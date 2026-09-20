import { useState, useCallback } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  immediate = false,
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await asyncFunction(...args);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ||
          (err instanceof Error ? err.message : "An unexpected error occurred");
        setState({ data: null, loading: false, error: message });
        throw err;
      }
    },
    [asyncFunction],
  );

  return {
    ...state,
    execute,
    setData: (data: T | null) => setState((prev) => ({ ...prev, data })),
  };
}

export default useAsync;
