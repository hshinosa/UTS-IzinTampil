import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-blue-600 text-white">Admin Header</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
