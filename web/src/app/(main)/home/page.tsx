"use client";

import PostComposer from "@/components/posts/PostComposer";
import PostsList from "@/components/posts/PostsList";
import { usePosts } from "@/hooks/usePosts";
import { useState } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/common/PullToRefresh";

export default function HomePage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refetch } = usePosts();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const { containerRef, pullDistance, isRefreshing: isPulling } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <div ref={containerRef} className="min-h-screen overflow-y-auto relative">
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isPulling} />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-twitter-extraLightGray">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-twitter-black">Home</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors"
          >
            <svg
              className={`w-5 h-5 text-twitter-darkGray ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Composer */}
      <PostComposer />

      {/* Posts Feed */}
      <PostsList />
    </div>
  );
}
