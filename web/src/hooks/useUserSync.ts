"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { createApiClient, userApi } from "@/lib/api";

export function useUserSync() {
  const { getToken, isSignedIn } = useAuth();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const api = createApiClient(getToken);
      return userApi.syncUser(api);
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      syncMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return syncMutation;
}
