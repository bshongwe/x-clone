"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, userApi } from "@/lib/api";

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
  });
}
