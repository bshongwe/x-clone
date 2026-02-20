"use client";

import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiMessageCircle, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient, notificationApi } from "@/lib/api";

interface NotificationCardProps {
  readonly notification: Notification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const api = createApiClient(getToken);
      return notificationApi.deleteNotification(api, notification._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <FiHeart className="text-red-500 fill-current" />;
      case "comment":
        return <FiMessageCircle className="text-twitter-blue" />;
      case "follow":
        return <FiUserPlus className="text-green-500" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "";
    }
  };

  return (
    <div className="border-b border-twitter-extraLightGray p-4 hover:bg-twitter-extraExtraLightGray transition-colors">
      <div className="flex space-x-3">
        <div className="flex-shrink-0 text-2xl mt-1">{getIcon()}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <Link href={`/profile/${notification.from.username}`}>
                {notification.from.profilePicture ? (
                  <Image
                    src={notification.from.profilePicture}
                    alt={notification.from.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-twitter-lightGray rounded-full"></div>
                )}
              </Link>

              <div className="flex-1">
                <p className="text-twitter-black">
                  <Link
                    href={`/profile/${notification.from.username}`}
                    className="font-bold hover:underline"
                  >
                    {notification.from.firstName} {notification.from.lastName}
                  </Link>{" "}
                  <span className="text-twitter-darkGray">{getMessage()}</span>
                </p>

                <p className="text-twitter-darkGray text-sm mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>

                {notification.post && (
                  <div className="mt-2 p-3 bg-twitter-extraExtraLightGray rounded-lg">
                    <p className="text-twitter-black text-sm">{notification.post.content}</p>
                  </div>
                )}

                {notification.comment && (
                  <div className="mt-2 p-3 bg-twitter-extraExtraLightGray rounded-lg">
                    <p className="text-twitter-black text-sm">{notification.comment.content}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => deleteMutation.mutate()}
              className="text-twitter-darkGray hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors ml-2"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
