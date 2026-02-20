"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiHome, FiBell, FiUser, FiLogOut, FiSearch, FiMail } from "react-icons/fi";
import { useAuth, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const navItems = [
    { icon: FiHome, label: "Home", href: "/home" },
    { icon: FiSearch, label: "Search", href: "/search" },
    { icon: FiMail, label: "Messages", href: "/messages" },
    { icon: FiBell, label: "Notifications", href: "/notifications" },
    {
      icon: FiUser,
      label: "Profile",
      href: `/profile/${user?.username || user?.emailAddresses[0]?.emailAddress?.split("@")[0]}`
    },
  ];

  return (
    <div className="h-full px-4 py-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-twitter-blue text-3xl font-bold">𝕏</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center space-x-4 px-4 py-3 rounded-full hover:bg-twitter-extraExtraLightGray transition-colors group"
          >
            <item.icon className="text-2xl text-twitter-black group-hover:text-twitter-blue" />
            <span className="text-xl text-twitter-black group-hover:text-twitter-blue font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-4 px-4 py-3 rounded-full hover:bg-red-50 transition-colors group mt-auto"
      >
        <FiLogOut className="text-2xl text-twitter-darkGray group-hover:text-red-500" />
        <span className="text-xl text-twitter-darkGray group-hover:text-red-500 font-medium">
          Sign Out
        </span>
      </button>
    </div>
  );
}
