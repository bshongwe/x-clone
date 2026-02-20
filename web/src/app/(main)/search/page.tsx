"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const TRENDING_TOPICS = [
  { topic: "#ReactNative", tweets: "125K" },
  { topic: "#TypeScript", tweets: "89K" },
  { topic: "#WebDevelopment", tweets: "234K" },
  { topic: "#AI", tweets: "567K" },
  { topic: "#TechNews", tweets: "98K" },
  { topic: "#NextJS", tweets: "156K" },
  { topic: "#JavaScript", tweets: "892K" },
  { topic: "#CloudComputing", tweets: "234K" },
] as const;

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen">
      {/* Header with Search */}
      <div className="sticky top-0 z-10 bg-white border-b border-twitter-extraLightGray">
        <div className="px-4 py-3">
          <div className="flex items-center bg-twitter-extraExtraLightGray rounded-full px-4 py-3">
            <FiSearch className="text-twitter-darkGray text-xl" />
            <input
              type="text"
              placeholder="Search Twitter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 ml-3 bg-transparent outline-none text-twitter-black placeholder-twitter-darkGray"
            />
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-twitter-black mb-4">Trending for you</h2>
        <div className="space-y-1">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.topic}
              className="w-full text-left py-3 px-4 hover:bg-twitter-extraExtraLightGray transition-colors rounded-lg"
            >
              <p className="text-twitter-darkGray text-sm">Trending in Technology</p>
              <p className="font-bold text-twitter-black text-lg">{item.topic}</p>
              <p className="text-twitter-darkGray text-sm">{item.tweets} Tweets</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
