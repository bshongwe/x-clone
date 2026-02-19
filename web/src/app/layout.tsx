import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "X Clone - Social Media Platform",
  description: "A modern social media platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
