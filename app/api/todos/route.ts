import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // Build where clause for Prisma
    const where: any = {}
    
    // Add search condition
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }
    
    // Add priority filter
    if (priority && priority !== 'all') {
      where.priority = priority
    }
    
    // Add status filter
    if (status && status !== 'all') {
      where.completed = status === 'completed'
    }
    
    // Add date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }
    
    // Get total count for pagination
    const total = await prisma.todo.count({ where })
    
    // Get todos with filters and pagination
    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })
    
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

    const todo = await prisma.todo.create({
      data: {
        title,
        description: description || null,
        completed: false,
        priority: priority || 'MEDIUM'
      }
    })
    
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create todo', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
