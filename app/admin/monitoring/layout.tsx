import { ReactNode } from "react";
import { Navbar } from "../../components/Navbar"; // pastikan path sesuai
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans antialiased flex flex-col`}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-4/5 mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
