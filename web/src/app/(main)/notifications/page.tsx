"use client";

import type { Notification } from "@/types";
import NotificationCard from "@/components/notifications/NotificationCard";
import { useNotifications } from "@/hooks/useNotifications";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullToRefreshIndicator } from "@/components/common/PullToRefresh";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const { containerRef, pullDistance, isRefreshing: isPulling } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      );
    }

    if (!notifications || notifications.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-twitter-darkGray text-lg">No notifications yet</p>
          <p className="text-twitter-lightGray text-sm mt-2">
            When someone likes or comments on your posts, you'll see it here
          </p>
        </div>
      );
    }

    return notifications.map((notification: Notification) => (
      <NotificationCard key={notification._id} notification={notification} />
    ));
  };

  return (
    <div ref={containerRef} className="min-h-screen overflow-y-auto relative">
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isPulling} />

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-twitter-extraLightGray">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-twitter-black">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div>{renderContent()}</div>
    </div>
  );
}
