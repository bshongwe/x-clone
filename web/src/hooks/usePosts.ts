"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, postApi } from "@/lib/api";

export function usePosts(username?: string) {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: username ? ["posts", "user", username] : ["posts"],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = username
        ? await postApi.getUserPosts(api, username)
        : await postApi.getPosts(api);
      return response.data.posts;
    },
    enabled: isSignedIn || !username, // Public posts can be fetched without auth
  });
}
