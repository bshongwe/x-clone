"use client";

import { useState } from "react";
import { useConversations, useMessages, useSendMessage, useDeleteConversation } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Image from "next/image";
import { FiSearch, FiEdit, FiArrowLeft, FiSend } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

type Conversation = {
  _id: string;
  participants: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  updatedAt: string;
};

type Message = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    profilePicture: string;
  };
  createdAt: string;
};

export default function MessagesPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  
  const { data: conversations = [], isLoading } = useConversations();
  const { data: messages = [] } = useMessages(selectedConversation?._id || null);
  const { data: currentUser } = useCurrentUser();
  const sendMessageMutation = useSendMessage();
  const deleteConversationMutation = useDeleteConversation();

  const deleteConversation = (conversationId: string) => {
    if (confirm("Are you sure you want to delete this conversation?")) {
      deleteConversationMutation.mutate(conversationId);
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const recipient = selectedConversation.participants.find(
      (p) => p._id !== currentUser?.user?._id
    );
    
    if (!recipient) return;

    sendMessageMutation.mutate(
      { recipientId: recipient._id, content: newMessage.trim() },
      {
        onSuccess: () => setNewMessage(""),
      }
    );
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== currentUser?.user?._id);
  };

  const renderConversationsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-twitter-blue"></div>
        </div>
      );
    }

    if (conversations.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-twitter-darkGray">No conversations yet</p>
          <p className="text-twitter-lightGray text-sm mt-2">Start a conversation by sending a message</p>
        </div>
      );
    }

    return (conversations as Conversation[]).map((conversation) => {
      const otherUser = getOtherParticipant(conversation);
      if (!otherUser) return null;

      const handleClick = () => setSelectedConversation(conversation);
      const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        deleteConversation(conversation._id);
      };
      const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      };

      return (
        <button
          key={conversation._id}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onKeyDown={handleKeyDown}
          className="w-full flex items-center p-4 border-b border-twitter-extraLightGray hover:bg-twitter-extraExtraLightGray transition-colors text-left"
        >
          <Image
            src={otherUser.profilePicture}
            alt={otherUser.username}
            width={48}
            height={48}
            className="rounded-full mr-3"
          />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <p className="font-semibold text-twitter-black">
                  {otherUser.firstName} {otherUser.lastName}
                </p>
                <p className="text-twitter-darkGray text-sm ml-1">@{otherUser.username}</p>
              </div>
              {conversation.lastMessage && (
                <p className="text-twitter-darkGray text-sm">
                  {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              )}
            </div>
            {conversation.lastMessage && (
              <p className="text-sm text-twitter-darkGray truncate">
                {conversation.lastMessage.content}
              </p>
            )}
          </div>
        </button>
      );
    });
  };

  if (selectedConversation) {
    const otherUser = getOtherParticipant(selectedConversation);
    if (!otherUser) return null;

    return (
      <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-twitter-extraLightGray">
          <div className="flex items-center px-4 py-3">
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors mr-3"
            >
              <FiArrowLeft className="text-xl text-twitter-blue" />
            </button>
            <Image
              src={otherUser.profilePicture}
              alt={otherUser.username}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-twitter-black">
                {otherUser.firstName} {otherUser.lastName}
              </p>
              <p className="text-twitter-darkGray text-sm">@{otherUser.username}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-center text-twitter-darkGray text-sm mb-4">
            This is the beginning of your conversation with {otherUser.firstName}
          </p>

          {(messages as Message[]).map((message) => {
            const isFromCurrentUser = message.sender._id === currentUser?.user?._id;
            return (
              <div key={message._id} className={`flex mb-3 ${isFromCurrentUser ? "justify-end" : ""}`}>
                {!isFromCurrentUser && (
                  <Image
                    src={message.sender.profilePicture}
                    alt={message.sender.username}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                )}
                <div className={`flex-1 max-w-xs ${isFromCurrentUser ? "items-end flex flex-col" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isFromCurrentUser ? "bg-twitter-blue text-white" : "bg-twitter-extraExtraLightGray text-twitter-black"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-twitter-darkGray mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-twitter-extraLightGray px-4 py-3">
          <div className="flex items-center">
            <div className="flex-1 flex items-center bg-twitter-extraExtraLightGray rounded-full px-4 py-3 mr-3">
              <input
                type="text"
                className="flex-1 bg-transparent outline-none text-twitter-black"
                placeholder="Start a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendMessageMutation.isPending}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                newMessage.trim() ? "bg-twitter-blue" : "bg-twitter-lightGray"
              }`}
            >
              <FiSend className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-white border-b border-twitter-extraLightGray">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-twitter-black">Messages</h1>
          <button className="p-2 hover:bg-twitter-extraExtraLightGray rounded-full transition-colors">
            <FiEdit className="text-twitter-blue text-xl" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-twitter-extraLightGray">
        <div className="flex items-center bg-twitter-extraExtraLightGray rounded-full px-4 py-3">
          <FiSearch className="text-twitter-darkGray" />
          <input
            type="text"
            placeholder="Search for people and groups"
            className="flex-1 ml-3 bg-transparent outline-none text-twitter-black placeholder-twitter-darkGray"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div>
        {renderConversationsList()}
      </div>

      {conversations.length > 0 && (
        <div className="px-4 py-2 border-t border-twitter-extraLightGray bg-twitter-extraExtraLightGray">
          <p className="text-xs text-twitter-darkGray text-center">
            Click to open • Right-click to delete
          </p>
        </div>
      )}
    </div>
  );
}
