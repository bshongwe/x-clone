"use client";

import { usePosts } from "@/hooks/usePosts";
import PostCard from "./PostCard";

interface PostsListProps {
  readonly username?: string;
}

export default function PostsList({ username }: PostsListProps) {
  const { data: posts, isLoading } = usePosts(username);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-twitter-darkGray text-lg">No posts yet</p>
        <p className="text-twitter-lightGray text-sm mt-2">
          {username ? "This user hasn't posted anything" : "Be the first to post!"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
