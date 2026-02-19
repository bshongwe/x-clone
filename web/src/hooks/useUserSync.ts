"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { createApiClient, userApi } from "@/lib/api";
import { logError, getUserErrorMessage } from "@/lib/errorHandler";

export function useUserSync() {
  const { getToken, isSignedIn } = useAuth();

  const syncMutation = useMutation({
    mutationFn: async () => {
      const api = createApiClient(getToken);
      return userApi.syncUser(api);
    },
    retry: (failureCount: number, error: unknown) => {
      // Retry up to 3 times for network errors or 5xx errors
      if (failureCount >= 3) return false;

      const errorMessage = getUserErrorMessage(error);
      // Don't retry client errors (4xx)
      if (errorMessage.includes("permission") || errorMessage.includes("sign in")) {
        return false;
      }

      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (error: unknown) => {
      logError("UserSync", error);
      // Silent fail for user sync - user can still use the app
      // Error will be logged for debugging
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
