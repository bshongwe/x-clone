"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, userApi } from "@/lib/api";
import { logError } from "@/lib/errorHandler";

export function useProfile(username?: string) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const profileQuery = useQuery({
    queryKey: ["profile", username],
    queryFn: async () => {
      if (!username) return null;
      const api = createApiClient(getToken);
      const response = await userApi.getUserProfile(api, username);
      return response.data;
    },
    enabled: !!username,
    retry: (failureCount: number, error: unknown) => {
      if (failureCount >= 3) return false;
      logError("FetchProfile", error);
      return true;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 60000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const api = createApiClient(getToken);
      return userApi.updateProfile(api, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditModalOpen(false);
    },
    onError: (error: unknown) => {
      logError("UpdateProfile", error);
    },
  });

  const openEditModal = (currentData: typeof formData) => {
    setFormData(currentData);
    setIsEditModalOpen(true);
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    ...profileQuery,
    isEditModalOpen,
    formData,
    openEditModal,
    closeEditModal: () => setIsEditModalOpen(false),
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
  };
}
