"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import { useUserSync } from "@/hooks/useUserSync";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  // Sync user with backend
  useUserSync();

  if (isLoaded && !isSignedIn) {
    redirect("/sign-in");
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 xl:w-72 fixed h-screen">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64 xl:ml-72 mr-0 lg:mr-80 border-x border-twitter-extraLightGray min-h-screen">
          {children}
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 fixed right-0 h-screen">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
