"use client";

import { User } from "@/types";
import Image from "next/image";
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { format } from "date-fns";

interface ProfileHeaderProps {
  readonly user: User;
  readonly isOwnProfile: boolean;
}

export default function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div>
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-twitter-blue to-twitter-darkBlue relative">
        {user.bannerImage && (
          <Image src={user.bannerImage} alt="Banner" fill className="object-cover" />
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="border-4 border-white rounded-full">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={user.username}
                width={128}
                height={128}
                className="rounded-full"
              />
            ) : (
              <div className="w-32 h-32 bg-twitter-lightGray rounded-full"></div>
            )}
          </div>

          {isOwnProfile && (
            <button className="mt-16 px-4 py-2 border border-twitter-extraLightGray rounded-full font-bold hover:bg-twitter-extraExtraLightGray transition-colors">
              Edit Profile
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-twitter-black">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-twitter-darkGray">@{user.username}</p>

          {user.bio && <p className="mt-3 text-twitter-black">{user.bio}</p>}

          <div className="flex flex-wrap items-center gap-4 mt-3 text-twitter-darkGray text-sm">
            {user.location && (
              <div className="flex items-center space-x-1">
                <FiMapPin />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <FiCalendar />
              <span>Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-3">
            <div>
              <span className="font-bold text-twitter-black">{user.following.length}</span>
              <span className="text-twitter-darkGray ml-1">Following</span>
            </div>
            <div>
              <span className="font-bold text-twitter-black">{user.followers.length}</span>
              <span className="text-twitter-darkGray ml-1">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
