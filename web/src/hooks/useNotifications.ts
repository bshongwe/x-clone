"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, notificationApi } from "@/lib/api";
import { logError } from "@/lib/errorHandler";

export function useNotifications() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = await notificationApi.getNotifications(api);
      return response.data.notifications;
    },
    enabled: isSignedIn,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: (failureCount: number, error: unknown) => {
      if (failureCount >= 2) return false;
      logError("FetchNotifications", error);
      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 20000, // Consider data fresh for 20 seconds
  });
}
