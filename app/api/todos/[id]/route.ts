import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

function getDb() {
  return new Database(path.join(process.cwd(), 'prisma', 'dev.db'))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, completed, priority } = body

    const db = getDb()
    
    // Build dynamic update query
    const updates = []
    const values = []
    
    if (title !== undefined) {
      updates.push('title = ?')
      values.push(title)
    }
    if (description !== undefined) {
      updates.push('description = ?')
      values.push(description)
    }
    if (completed !== undefined) {
      updates.push('completed = ?')
      values.push(completed ? 1 : 0)
    }
    if (priority !== undefined) {
      updates.push('priority = ?')
      values.push(priority)
    }
    
    if (updates.length === 0) {
      db.close()
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }
    
    updates.push('updatedAt = ?')
    const updatedAt = new Date().toISOString()
    values.push(updatedAt)
    values.push(parseInt(id))
    
    const result = db.prepare(`
      UPDATE todos SET ${updates.join(', ')} WHERE id = ?
    `).run(...values)
    
    if (result.changes === 0) {
      db.close()
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(parseInt(id))
    db.close()
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const db = getDb()
    const result = db.prepare('DELETE FROM todos WHERE id = ?').run(parseInt(id))
    db.close()
    
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
