"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, postApi } from "@/lib/api";
import { Post } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CommentsModal from "./CommentsModal";
import { formatNumber } from "@/lib/utils";

interface PostCardProps {
  readonly post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: currentUserData } = useCurrentUser();
  const [showComments, setShowComments] = useState(false);

  const currentUserId = currentUserData?.user?._id || "";
  const isLiked = post.likes.includes(currentUserId);
  const isOwnPost = post.user._id === currentUserId;

  // Helper: Remove like optimistically
  const removeLike = (currentLikes: string[]): string[] => {
    return currentLikes.filter((id) => id !== currentUserId);
  };

  // Helper: Add like optimistically
  const addLike = (currentLikes: string[]): string[] => {
    return [...currentLikes, currentUserId];
  };

  // Helper: Update posts data with new like state
  const updatePostsWithLike = (oldData: any): any => {
    if (!Array.isArray(oldData)) return oldData;

    return oldData.map((p: any) => {
      if (p._id !== post._id) return p;
      const updatedLikes = isLiked ? removeLike(p.likes) : addLike(p.likes);
      return { ...p, likes: updatedLikes };
    });
  };

  const likeMutation = useMutation({
    mutationFn: async () => {
      const api = createApiClient(getToken);
      return postApi.likePost(api, post._id);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], updatePostsWithLike);

      return { previousPosts };
    },
    onError: (_err: unknown, _variables: unknown, context: any) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const api = createApiClient(getToken);
      return postApi.deletePost(api, post._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <>
      <div className="border-b border-twitter-extraLightGray p-4 hover:bg-twitter-extraExtraLightGray transition-colors">
        <div className="flex space-x-3">
          <Link href={`/profile/${post.user.username}`}>
            {post.user.profilePicture ? (
              <Image
                src={post.user.profilePicture}
                alt={post.user.username}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-twitter-lightGray rounded-full"></div>
            )}
          </Link>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link
                  href={`/profile/${post.user.username}`}
                  className="font-bold text-twitter-black hover:underline"
                >
                  {post.user.firstName} {post.user.lastName}
                </Link>
                <span className="text-twitter-darkGray">@{post.user.username}</span>
                <span className="text-twitter-darkGray">·</span>
                <span className="text-twitter-darkGray text-sm">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>

              {isOwnPost && (
                <button
                  onClick={() => deleteMutation.mutate()}
                  className="text-twitter-darkGray hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>

            <p className="text-twitter-black mt-2 whitespace-pre-wrap">{post.content}</p>

            {post.image && (
              <div className="mt-3">
                <Image
                  src={post.image}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="rounded-2xl max-h-96 w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center space-x-12 mt-4">
              <button
                onClick={() => setShowComments(true)}
                className="flex items-center space-x-2 text-twitter-darkGray hover:text-twitter-blue group"
              >
                <div className="p-2 rounded-full group-hover:bg-twitter-blue group-hover:bg-opacity-10">
                  <FiMessageCircle />
                </div>
                <span className="text-sm">{formatNumber(post.comments.length)}</span>
              </button>

              <button
                onClick={() => likeMutation.mutate()}
                className={`flex items-center space-x-2 group ${
                  isLiked ? "text-red-500" : "text-twitter-darkGray hover:text-red-500"
                }`}
              >
                <div className="p-2 rounded-full group-hover:bg-red-500 group-hover:bg-opacity-10">
                  <FiHeart className={isLiked ? "fill-current" : ""} />
                </div>
                <span className="text-sm">{formatNumber(post.likes.length)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showComments && (
        <CommentsModal post={post} onClose={() => setShowComments(false)} />
      )}
    </>
  );
}
