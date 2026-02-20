"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, messageApi } from "@/lib/api";

export function useConversations() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const api = createApiClient(getToken);
      const response = await messageApi.getConversations(api);
      return response.data;
    },
  });
}

export function useMessages(conversationId: string | null) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const api = createApiClient(getToken);
      const response = await messageApi.getMessages(api, conversationId);
      return response.data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { recipientId: string; content: string }) => {
      const api = createApiClient(getToken);
      return messageApi.sendMessage(api, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useDeleteConversation() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      const api = createApiClient(getToken);
      return messageApi.deleteConversation(api, conversationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
