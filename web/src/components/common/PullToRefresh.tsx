"use client";

import React from "react";

interface PullToRefreshIndicatorProps {
  readonly pullDistance: number;
  readonly isRefreshing: boolean;
  readonly threshold?: number;
}

export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min((pullDistance / threshold) * 100, 100);

  if (!isRefreshing && pullDistance === 0) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 flex justify-center items-center bg-white transition-all duration-300"
      style={{
        height: isRefreshing ? "60px" : `${pullDistance}px`,
        opacity: isRefreshing || pullDistance > 0 ? 1 : 0,
      }}
    >
      {isRefreshing ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-twitter-blue"></div>
          <span className="text-sm text-twitter-darkGray">Refreshing...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <svg
            className="w-6 h-6 text-twitter-blue transition-transform"
            style={{
              transform: `rotate(${progress * 3.6}deg)`,
            }}
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
          {pullDistance >= threshold && (
            <span className="text-xs text-twitter-blue mt-1">Release to refresh</span>
          )}
        </div>
      )}
    </div>
  );
}
