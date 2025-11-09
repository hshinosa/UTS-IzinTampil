'use client';

import React from 'react';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  tasksByPriority: Array<{ priority: string; count: number }>;
  tasksByDate: Array<{ date: string; completed: number; created: number }>;
  completionRateByMonth: Array<{ month: string; rate: number }>;
}

interface AnalyticsContentProps {
  data: AnalyticsData;
}

export default function AnalyticsContent({ data }: AnalyticsContentProps) {
  const completionPercentage = data.totalTasks > 0 
    ? Math.round((data.completedTasks / data.totalTasks) * 100) 
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': 
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium': 
        return (
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'low': 
        return (
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default: 
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{data.completedTasks}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {completionPercentage}% completion rate
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{data.inProgressTasks}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{data.pendingTasks}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.482 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Tasks by Priority
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.tasksByPriority?.map((priority, index) => {
            const percentage = data.totalTasks > 0 ? Math.round((priority.count / data.totalTasks) * 100) : 0;
            return (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(priority.priority)}
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {priority.priority}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {priority.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPriorityColor(priority.priority)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {percentage}% of total
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Completion Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Monthly Completion Rate
        </h3>
        <div className="space-y-4">
          {data.completionRateByMonth?.map((month, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {month.month}
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 min-w-[200px]">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${month.rate}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[3rem] text-right">
                {month.rate}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-4 8V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 8h16m-2-4V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
          </svg>
          Daily Task Activity
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.tasksByDate?.slice(-10).map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[80px]">
                  {new Date(day.date).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed: {day.completed}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created: {day.created}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Total: {day.completed + day.created}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
