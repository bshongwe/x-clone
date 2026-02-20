import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, messageApi } from "../utils/api";

export const useConversations = () => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => messageApi.getConversations(api).then((res) => res.data),
  });
};

export const useMessages = (conversationId: string | null) => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      conversationId
        ? messageApi.getMessages(api, conversationId).then((res) => res.data)
        : Promise.resolve([]),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { recipientId: string; content: string }) =>
      messageApi.sendMessage(api, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

export const useDeleteConversation = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => messageApi.deleteConversation(api, conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
