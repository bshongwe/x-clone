"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, postApi } from "@/lib/api";
import { logError } from "@/lib/errorHandler";

export function usePosts(username?: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: username ? ["posts", "user", username] : ["posts"],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = username
        ? await postApi.getUserPosts(api, username)
        : await postApi.getPosts(api);
      return response.data.posts;
    },
    enabled: isSignedIn || !username, // Public posts can be fetched without auth
    retry: (failureCount: number, error: unknown) => {
      // Retry up to 3 times for network errors
      if (failureCount >= 3) return false;

      // Log the error
      logError("FetchPosts", error);

      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 300000, // Keep unused data in cache for 5 minutes
  });
}
