import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const priority = searchParams.get('priority') || ''
    const status = searchParams.get('status') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''

    const db = getDb()
    
    // Build the base query
    let query = 'SELECT * FROM todos WHERE 1=1'
    const params: (string | number)[] = []
    
    // Add search condition
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    
    // Add priority filter
    if (priority && priority !== 'all') {
      query += ' AND priority = ?'
      params.push(priority)
    }
    
    // Add status filter
    if (status && status !== 'all') {
      if (status === 'completed') {
        query += ' AND completed = 1'
      } else if (status === 'pending') {
        query += ' AND completed = 0'
      }
    }
    
    // Add date range filter
    if (dateFrom) {
      query += ' AND createdAt >= ?'
      params.push(dateFrom)
    }
    
    if (dateTo) {
      query += ' AND createdAt <= ?'
      params.push(dateTo)
    }
    
    // Add ordering and pagination
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?'
    params.push(limit, (page - 1) * limit)
    
    // Get todos with filters and pagination
    const todos = db.prepare(query).all(...params)
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM todos WHERE 1=1'
    const countParams: (string | number)[] = []
    
    if (search) {
      countQuery += ' AND (title LIKE ? OR description LIKE ?)'
      countParams.push(`%${search}%`, `%${search}%`)
    }
    
    if (priority && priority !== 'all') {
      countQuery += ' AND priority = ?'
      countParams.push(priority)
    }
    
    if (status && status !== 'all') {
      if (status === 'completed') {
        countQuery += ' AND completed = 1'
      } else if (status === 'pending') {
        countQuery += ' AND completed = 0'
      }
    }
    
    if (dateFrom) {
      countQuery += ' AND createdAt >= ?'
      countParams.push(dateFrom)
    }
    
    if (dateTo) {
      countQuery += ' AND createdAt <= ?'
      countParams.push(dateTo)
    }
    
    const { total } = db.prepare(countQuery).get(...countParams) as { total: number }
    
    db.close()
    
    return NextResponse.json({
      data: todos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
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
    const { title, description, priority } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const db = getDb()
    const now = new Date().toISOString()
    const result = db.prepare(`
      INSERT INTO todos (title, description, completed, priority, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, description || null, 0, priority || 'MEDIUM', now, now)
    
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
