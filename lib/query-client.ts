import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

function onError(error: unknown) {
  if (error instanceof ApiError && error.status >= 500) {
    toast.error("Server error. Please try again later.");
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError }),
  defaultOptions: {
    queries: { retry: false },
  },
});