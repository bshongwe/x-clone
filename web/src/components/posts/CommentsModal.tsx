"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, commentApi } from "@/lib/api";
import { useComments } from "@/hooks/useComments";
import { Post, Comment } from "@/types";
import { FiX } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface CommentsModalProps {
  readonly post: Post;
  readonly onClose: () => void;
}

export default function CommentsModal({ post, onClose }: CommentsModalProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const { data: comments, isLoading } = useComments(post._id);

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const api = createApiClient(getToken);
      return commentApi.createComment(api, post._id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommentMutation.mutate(newComment);
    }
  };

  const handleModalContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleModalContentKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const renderCommentsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      );
    }

    if (!comments || comments.length === 0) {
      return (
        <div className="text-center py-8 text-twitter-darkGray">
          No comments yet. Be the first to comment!
        </div>
      );
    }

    return comments.map((comment: Comment) => (
      <div
        key={comment._id}
        className="p-4 border-b border-twitter-extraLightGray hover:bg-twitter-extraExtraLightGray"
      >
        <div className="flex items-start space-x-3">
          {comment.user.profilePicture ? (
            <Image
              src={comment.user.profilePicture}
              alt={comment.user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-twitter-lightGray rounded-full"></div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold">
                {comment.user.firstName} {comment.user.lastName}
              </span>
              <span className="text-twitter-darkGray text-sm">
                @{comment.user.username}
              </span>
              <span className="text-twitter-darkGray text-sm">·</span>
              <span className="text-twitter-darkGray text-sm">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-twitter-black mt-1">{comment.content}</p>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <button
      type="button"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 border-none cursor-default"
      onClick={onClose}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      aria-label="Close modal"
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={handleModalContentClick}
        onKeyDown={handleModalContentKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-twitter-extraLightGray">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-180px)]">
          {/* Original Post */}
          <div className="p-4 border-b border-twitter-extraLightGray">
            <div className="flex items-start space-x-3">
              {post.user.profilePicture ? (
                <Image
                  src={post.user.profilePicture}
                  alt={post.user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-twitter-lightGray rounded-full"></div>
              )}
              <div>
                <p className="font-bold">
                  {post.user.firstName} {post.user.lastName}
                </p>
                <p className="text-twitter-black">{post.content}</p>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div>{renderCommentsList()}</div>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-twitter-extraLightGray">
          <div className="flex space-x-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 resize-none outline-none border border-twitter-extraLightGray rounded-lg p-3"
              rows={2}
              maxLength={280}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || createCommentMutation.isPending}
              className="bg-twitter-blue text-white px-6 py-2 rounded-full font-bold hover:bg-twitter-darkBlue disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            >
              {createCommentMutation.isPending ? "..." : "Reply"}
            </button>
          </div>
        </form>
      </div>
    </button>
  );
}
