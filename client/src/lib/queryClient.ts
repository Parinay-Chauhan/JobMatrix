import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Data is fresh for 2 minutes
      gcTime: 1000 * 60 * 10, // Cache persists for 10 minutes
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;
        // Don't retry on client errors (401, 403, 404, 400)
        if (status && [400, 401, 403, 404].includes(status)) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
