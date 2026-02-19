"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, postApi } from "@/lib/api";

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
  });
}
