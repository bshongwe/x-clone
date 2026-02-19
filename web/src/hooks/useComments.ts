"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, commentApi } from "@/lib/api";

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
  });
}
