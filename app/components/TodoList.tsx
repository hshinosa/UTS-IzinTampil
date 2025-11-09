import { Skeleton } from "./Skeleton";

export function TodoList() {
  const todoItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Todo List
        </h2>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {todoItems.map((_, index) => (
            <div key={index} className="p-6">
              <div className="flex items-center space-x-4">
                {/* Checkbox skeleton */}
                <Skeleton className="h-5 w-5 rounded" />
                
                {/* Todo content */}
                <div className="flex-1 space-y-2">
                  {/* Title skeleton */}
                  <Skeleton className="h-5 w-3/4" />
                  {/* Description skeleton */}
                  <Skeleton className="h-4 w-1/2" />
                  {/* Meta info skeleton */}
                  <div className="flex items-center space-x-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>

                {/* Actions skeleton */}
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
