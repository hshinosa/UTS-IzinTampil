'use client'

import { useTodos } from "@/hooks/useTodos"

export function StatisticsWithData() {
  const { data: todos, isLoading } = useTodos()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Data Statistik Todo List
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <div className="h-4 w-24 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalTasks = todos?.length || 0
  const completedTasks = todos?.filter(todo => todo.completed).length || 0
  const inProgressTasks = totalTasks - completedTasks
  const pendingTasks = todos?.filter(todo => !todo.completed).length || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Data Statistik Todo List
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Tasks
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {totalTasks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            All tasks
          </p>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-green-500 dark:text-green-400 mb-2">
            Completed
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {completedTasks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% completed
          </p>
        </div>

        {/* In Progress Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-blue-500 dark:text-blue-400 mb-2">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {inProgressTasks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Active tasks
          </p>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-orange-500 dark:text-orange-400 mb-2">
            Pending
          </h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {pendingTasks}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Not started
          </p>
        </div>
      </div>
    </div>
  )
}
