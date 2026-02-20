"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";

interface EditProfileModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly formData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
  };
  readonly onSave: () => void;
  readonly onFieldChange: (field: string, value: string) => void;
  readonly isUpdating: boolean;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  formData,
  onSave,
  onFieldChange,
  isUpdating,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-twitter-extraLightGray">
          <button
            onClick={onClose}
            className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors"
          >
            <FiX className="text-xl" />
          </button>
          <h2 className="text-xl font-bold text-twitter-black">Edit Profile</h2>
          <button
            onClick={onSave}
            disabled={isUpdating}
            className="bg-twitter-black text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-90 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm text-twitter-darkGray mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
              className="w-full border border-twitter-extraLightGray rounded-lg px-4 py-3 focus:outline-none focus:border-twitter-blue"
              placeholder="Your first name"
            />
          </div>

          <div>
            <label className="block text-sm text-twitter-darkGray mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
              className="w-full border border-twitter-extraLightGray rounded-lg px-4 py-3 focus:outline-none focus:border-twitter-blue"
              placeholder="Your last name"
            />
          </div>

          <div>
            <label className="block text-sm text-twitter-darkGray mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => onFieldChange("bio", e.target.value)}
              className="w-full border border-twitter-extraLightGray rounded-lg px-4 py-3 focus:outline-none focus:border-twitter-blue resize-none"
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm text-twitter-darkGray mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
              className="w-full border border-twitter-extraLightGray rounded-lg px-4 py-3 focus:outline-none focus:border-twitter-blue"
              placeholder="Where are you located?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
