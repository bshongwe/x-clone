"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, commentApi } from "@/lib/api";
import { logError } from "@/lib/errorHandler";

export function useComments(postId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = await commentApi.getComments(api, postId);
      return response.data.comments;
    },
    enabled: !!postId,
    retry: (failureCount: number, error: unknown) => {
      if (failureCount >= 3) return false;
      logError("FetchComments", error);
      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
}
