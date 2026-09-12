// app/providers.tsx
'use client'

import { getQueryClient } from '@/src/lib/get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid using useState to initialize the query client if you are
  // using prefetching or streaming SSR, as it can cause multiple instantiations.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}