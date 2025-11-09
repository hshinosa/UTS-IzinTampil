'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TodoInput, TodoSchema, TodosQuery } from "@/lib/validations/todo"
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos"
import { TodoFilters } from "./TodoFilters"
import { Pagination } from "./Pagination"

export function TodoList() {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<TodosQuery>({
    page: 1,
    limit: 10,
    search: '',
    priority: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })
  
  const { data, isLoading } = useTodos(filters)
  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()
  
  const todos = data?.data || []
  const pagination = data?.pagination

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoInput>({
    resolver: zodResolver(TodoSchema),
  })

  const onSubmit = (data: TodoInput) => {
    createTodo.mutate({
      ...data,
      priority: data.priority || 'MEDIUM'
    })
    reset()
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Todo List
          </h2>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleFiltersChange = (newFilters: TodosQuery) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Todo List
        </h2>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Todo
        </button>
      </div>

      {/* Filters Component */}
      <TodoFilters onFiltersChange={handleFiltersChange} />

      {/* Add Todo Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Todo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Todo title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Todo description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  {...register('priority')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={createTodo.isPending}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition"
                >
                  {createTodo.isPending ? 'Creating...' : 'Create Todo'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    reset()
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Todos List */}
      {!todos || todos.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No todos yet. Click &ldquo;Add Todo&rdquo; to create your first todo!</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {todos.map((todo) => (
                <div key={todo.id} className="p-6">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      onChange={(e) => {
                        updateTodo.mutate({
                          id: todo.id,
                          data: { completed: e.target.checked }
                        })
                      }}
                    />
                    
                    <div className="flex-1">
                      <h3 className={`font-medium text-gray-900 dark:text-white ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="mt-1 text-gray-600 dark:text-gray-300">{todo.description}</p>
                      )}
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          todo.completed 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                        }`}>
                          {todo.completed ? 'Completed' : 'Pending'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          todo.priority === 'HIGH' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                            : todo.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        }`}>
                          {todo.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteTodo.mutate(todo.id)}
                        disabled={deleteTodo.isPending}
                        className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400 transition"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Component */}
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
