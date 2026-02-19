"use client";

import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        redirect("/home");
      } else {
        redirect("/sign-in");
      }
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-twitter-blue"></div>
    </div>
  );
}
