import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params
    const id = parseInt(idParam)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    const allowedFields = ['title', 'description', 'completed', 'priority']

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key]
      }
    })

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(todo)
  } catch (error) {
    console.error('PATCH error:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params
    const id = parseInt(idParam)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid todo ID' },
        { status: 400 }
      )
    }

    await prisma.todo.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true, deletedId: id })
  } catch (error) {
    console.error('DELETE error:', error)
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
