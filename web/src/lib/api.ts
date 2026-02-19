import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};

// API Endpoints
export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  getUserProfile: (api: AxiosInstance, username: string) => api.get(`/users/profile/${username}`),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
  followUser: (api: AxiosInstance, userId: string) => api.post(`/users/follow/${userId}`),
};

export const postApi = {
  createPost: (api: AxiosInstance, data: FormData) =>
    api.post("/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
};

export const commentApi = {
  getComments: (api: AxiosInstance, postId: string) => api.get(`/comments/post/${postId}`),
  createComment: (api: AxiosInstance, postId: string, content: string) =>
    api.post(`/comments/post/${postId}`, { content }),
  deleteComment: (api: AxiosInstance, commentId: string) => api.delete(`/comments/${commentId}`),
};

export const notificationApi = {
  getNotifications: (api: AxiosInstance) => api.get("/notifications"),
  deleteNotification: (api: AxiosInstance, notificationId: string) =>
    api.delete(`/notifications/${notificationId}`),
};
