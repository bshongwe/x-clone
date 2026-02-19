"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, userApi } from "@/lib/api";

export function useCurrentUser() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = await userApi.getCurrentUser(api);
      return response.data;
    },
    enabled: isSignedIn,
  });
}
