"use client";

export default function RightSidebar() {
  return (
    <div className="h-full px-4 py-4">
      <div className="bg-twitter-extraExtraLightGray rounded-2xl p-4">
        <h2 className="text-xl font-bold text-twitter-black mb-4">What's happening</h2>
        <div className="space-y-4">
          <div className="hover:bg-white p-2 rounded cursor-pointer transition-colors">
            <p className="text-sm text-twitter-darkGray">Trending in Tech</p>
            <p className="font-bold text-twitter-black">#NextJS</p>
            <p className="text-sm text-twitter-darkGray">12.5K posts</p>
          </div>
          <div className="hover:bg-white p-2 rounded cursor-pointer transition-colors">
            <p className="text-sm text-twitter-darkGray">Trending Worldwide</p>
            <p className="font-bold text-twitter-black">#WebDevelopment</p>
            <p className="text-sm text-twitter-darkGray">25.3K posts</p>
          </div>
          <div className="hover:bg-white p-2 rounded cursor-pointer transition-colors">
            <p className="text-sm text-twitter-darkGray">Technology · Trending</p>
            <p className="font-bold text-twitter-black">React 19</p>
            <p className="text-sm text-twitter-darkGray">18.2K posts</p>
          </div>
        </div>
      </div>

      <div className="bg-twitter-extraExtraLightGray rounded-2xl p-4 mt-4">
        <h2 className="text-xl font-bold text-twitter-black mb-4">Who to follow</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-twitter-blue rounded-full"></div>
              <div>
                <p className="font-bold text-twitter-black text-sm">Suggested User</p>
                <p className="text-twitter-darkGray text-sm">@suggested</p>
              </div>
            </div>
            <button className="bg-twitter-black text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-opacity-90">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
