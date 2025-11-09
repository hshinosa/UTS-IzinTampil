'use client'

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { Toaster } from "sonner";

export function QueryClientProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}
