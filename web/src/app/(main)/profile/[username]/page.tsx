"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProfileHeader from "@/components/profile/ProfileHeader";
import PostsList from "@/components/posts/PostsList";
import { useState } from "react";

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: profile, isLoading } = useProfile(username);
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"posts" | "likes">("posts");

  const isOwnProfile = currentUser?.user?.username === username;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-twitter-darkGray text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <ProfileHeader user={profile.user} isOwnProfile={isOwnProfile} />

      {/* Tabs */}
      <div className="flex border-b border-twitter-extraLightGray">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-4 text-center font-semibold transition-colors ${
            activeTab === "posts"
              ? "text-twitter-black border-b-4 border-twitter-blue"
              : "text-twitter-darkGray hover:bg-twitter-extraExtraLightGray"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex-1 py-4 text-center font-semibold transition-colors ${
            activeTab === "likes"
              ? "text-twitter-black border-b-4 border-twitter-blue"
              : "text-twitter-darkGray hover:bg-twitter-extraExtraLightGray"
          }`}
        >
          Likes
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "posts" && <PostsList username={username} />}
        {activeTab === "likes" && (
          <div className="text-center py-12">
            <p className="text-twitter-darkGray">Liked posts coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
