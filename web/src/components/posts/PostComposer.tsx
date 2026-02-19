"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCreatePost } from "@/hooks/useCreatePost";
import { FiImage, FiX } from "react-icons/fi";
import Image from "next/image";

export default function PostComposer() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createPost = useCreatePost();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    try {
      await createPost.mutateAsync({
        content,
        image: selectedImage || undefined,
      });
      setContent("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="border-b border-twitter-extraLightGray p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 bg-twitter-lightGray rounded-full"></div>
            )}
          </div>

          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full text-xl resize-none outline-none placeholder-twitter-darkGray"
              rows={3}
              maxLength={280}
            />

            {imagePreview && (
              <div className="relative mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-2xl max-h-96 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-twitter-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-100"
                >
                  <FiX />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-twitter-extraLightGray">
              <label className="cursor-pointer text-twitter-blue hover:bg-twitter-extraExtraLightGray p-2 rounded-full transition-colors">
                <FiImage className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={(!content.trim() && !selectedImage) || createPost.isPending}
                className="bg-twitter-blue text-white px-6 py-2 rounded-full font-bold hover:bg-twitter-darkBlue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createPost.isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
