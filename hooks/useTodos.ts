'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TodoInput, TodoResponse, UpdateTodoInput, TodosQuery, PaginatedTodosResponse } from "@/lib/validations/todo"
import { toast } from "sonner"

const API_URL = '/api/todos'

async function fetchTodos(query?: TodosQuery): Promise<PaginatedTodosResponse> {
  const searchParams = new URLSearchParams()
  
  if (query) {
    if (query.page && query.page !== 1) searchParams.set('page', query.page.toString())
    if (query.limit && query.limit !== 10) searchParams.set('limit', query.limit.toString())
    if (query.search) searchParams.set('search', query.search)
    if (query.priority && query.priority !== 'all') searchParams.set('priority', query.priority)
    if (query.status && query.status !== 'all') searchParams.set('status', query.status)
    if (query.dateFrom) searchParams.set('dateFrom', query.dateFrom)
    if (query.dateTo) searchParams.set('dateTo', query.dateTo)
  }
  
  const url = searchParams.toString() ? `${API_URL}?${searchParams.toString()}` : API_URL
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  const result = await response.json() as {
    data: Array<{
      id: number
      title: string
      description: string | null
      completed: number | boolean
      priority: string
      createdAt: string
      updatedAt: string
    }>
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  
  return {
    data: result.data.map((todo) => ({
      ...todo,
      completed: (todo.completed as number) === 1 || (todo.completed as boolean) === true
    })),
    pagination: result.pagination
  }
}

async function createTodo(data: TodoInput): Promise<TodoResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create todo')
  }
  
  const rawTodo = await response.json()
  const todo = {
    ...rawTodo,
    completed: (rawTodo.completed as number) === 1 || (rawTodo.completed as boolean) === true
  }
  return todo as TodoResponse
}

async function updateTodo(id: number, data: UpdateTodoInput): Promise<TodoResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update todo')
  }
  
  const rawTodo = await response.json()
  const todo = {
    ...rawTodo,
    completed: (rawTodo.completed as number) === 1 || (rawTodo.completed as boolean) === true
  }
  return todo as TodoResponse
}

async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    throw new Error('Failed to delete todo')
  }
}

export function useTodos(query?: TodosQuery) {
  return useQuery({
    queryKey: ['todos', query],
    queryFn: () => fetchTodos(query),
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create todo: ${error.message}`)
    },
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoInput }) => 
      updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update todo: ${error.message}`)
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete todo: ${error.message}`)
    },
  })
}
