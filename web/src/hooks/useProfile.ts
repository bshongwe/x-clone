"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, userApi } from "@/lib/api";
import { logError } from "@/lib/errorHandler";

export function useProfile(username: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = await userApi.getUserProfile(api, username);
      return response.data;
    },
    enabled: !!username,
    retry: (failureCount: number, error: unknown) => {
      if (failureCount >= 3) return false;
      logError("FetchProfile", error);
      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 60000, // Consider data fresh for 1 minute
  });
}
