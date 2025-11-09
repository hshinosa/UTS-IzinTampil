import { Skeleton } from "./Skeleton";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Izin Tampil DevOps
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* User skeleton - avatar */}
              <Skeleton className="h-8 w-8 rounded-full" />
              {/* User skeleton - name */}
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
