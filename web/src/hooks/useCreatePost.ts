"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, postApi } from "@/lib/api";
import { logError, getUserErrorMessage } from "@/lib/errorHandler";

export function useCreatePost() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; image?: File }) => {
      const api = createApiClient(getToken);
      const formData = new FormData();

      if (data.content) {
        formData.append("content", data.content);
      }
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await postApi.createPost(api, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: unknown) => {
      logError("CreatePost", error);
      const userMessage = getUserErrorMessage(error);

      // Show user-friendly error message
      // In a real app, this would use a toast notification
      alert(`Failed to create post: ${userMessage}`);
    },
    retry: (failureCount: number, error: unknown) => {
      // Only retry network errors, not client errors
      if (failureCount >= 2) return false;

      const errorMessage = getUserErrorMessage(error);
      // Don't retry validation or auth errors
      if (
        errorMessage.includes("Invalid") ||
        errorMessage.includes("permission") ||
        errorMessage.includes("sign in")
      ) {
        return false;
      }

      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}
