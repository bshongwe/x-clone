"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, notificationApi } from "@/lib/api";

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
  });
}
