import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET() {
  try {
    const db = getDb()
    const todos = db.prepare('SELECT * FROM todos ORDER BY createdAt DESC').all()
    db.close()
    
    return NextResponse.json(todos)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const db = getDb()
    const now = new Date().toISOString()
    const result = db.prepare(`
      INSERT INTO todos (title, description, completed, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?)
    `).run(title, description || null, 0, now, now)
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid)
    db.close()
    
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create todo', message: error instanceof Error ? error.message : 'Unknown error', details: error },
      { status: 500 }
    )
  }
}
