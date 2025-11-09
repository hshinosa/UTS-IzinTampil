'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TodoInput, TodoSchema } from "@/lib/validations/todo"
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from "@/hooks/useTodos"

export default function TodosPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: todos, isLoading } = useTodos()
  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoInput>({
    resolver: zodResolver(TodoSchema),
  })

  const onSubmit = (data: TodoInput) => {
    createTodo.mutate(data)
    reset()
    setIsOpen(false)
  }

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Todo
        </button>
      </div>

      {/* Add Todo Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Todo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Todo title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Todo description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
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
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Todos List */}
      {todos?.data && todos.data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No todos yet. Click &ldquo;Add Todo&rdquo; to create your first todo!
        </div>
      ) : (
        <div className="space-y-4">
          {todos?.data?.map((todo) => (
            <div
              key={todo.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex items-start space-x-3">
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
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="mt-1 text-gray-600">{todo.description}</p>
                  )}
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-400">
                      Created: {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => deleteTodo.mutate(todo.id)}
                      disabled={deleteTodo.isPending}
                      className="text-red-500 hover:text-red-700 text-sm font-medium disabled:text-gray-400"
                    >
                      {deleteTodo.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
