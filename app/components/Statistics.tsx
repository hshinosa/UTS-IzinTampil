import { Skeleton } from "./Skeleton";

export function Statistics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Data Statistik Todo List
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* In Progress Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
