import { useConversations, useMessages, useSendMessage, useDeleteConversation } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate } from "@/utils/formatters";

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

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { data: conversations = [], isLoading } = useConversations();
  const { data: messages = [] } = useMessages(selectedConversation?._id || null);
  const { currentUser } = useCurrentUser();
  const sendMessageMutation = useSendMessage();
  const deleteConversationMutation = useDeleteConversation();

  const deleteConversation = (conversationId: string) => {
    Alert.alert("Delete Conversation", "Are you sure you want to delete this conversation?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteConversationMutation.mutate(conversationId);
          if (selectedConversation?._id === conversationId) {
            closeChatModal();
          }
        },
      },
    ]);
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const closeChatModal = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    setNewMessage("");
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const recipient = selectedConversation.participants.find((p) => p._id !== currentUser?._id);
    if (!recipient) return;

    sendMessageMutation.mutate(
      { recipientId: recipient._id, content: newMessage.trim() },
      {
        onSuccess: () => {
          setNewMessage("");
          Alert.alert("Success", `Message sent to ${recipient.firstName}`);
        },
      }
    );
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== currentUser?._id);
  };

  const renderConversationsList = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <ActivityIndicator size="large" color="#1DA1F2" />
          <Text className="text-gray-500 mt-4">Loading conversations...</Text>
        </View>
      );
    }

    if (conversations.length === 0) {
      return (
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-gray-500 mb-2">No conversations yet</Text>
          <Text className="text-gray-400 text-sm text-center">
            Start a conversation by sending a message
          </Text>
        </View>
      );
    }

    return (conversations as Conversation[]).map((conversation) => {
      const otherUser = getOtherParticipant(conversation);
      if (!otherUser) return null;

      return (
        <TouchableOpacity
          key={conversation._id}
          className="flex-row items-center p-4 border-b border-gray-50 active:bg-gray-50"
          onPress={() => openConversation(conversation)}
          onLongPress={() => deleteConversation(conversation._id)}
        >
          <Image
            source={{ uri: otherUser.profilePicture }}
            className="size-12 rounded-full mr-3"
          />

          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-row items-center gap-1">
                <Text className="font-semibold text-gray-900">
                  {otherUser.firstName} {otherUser.lastName}
                </Text>
                <Text className="text-gray-500 text-sm ml-1">@{otherUser.username}</Text>
              </View>
              {conversation.lastMessage && (
                <Text className="text-gray-500 text-sm">
                  {formatDate(conversation.lastMessage.createdAt)}
                </Text>
              )}
            </View>
            {conversation.lastMessage && (
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {conversation.lastMessage.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-3">
          <Feather name="search" size={20} color="#657786" />
          <TextInput
            placeholder="Search for people and groups"
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#657786"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* CONVERSATIONS LIST */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {renderConversationsList()}
      </ScrollView>

      {/* Quick Actions */}
      <View className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <Text className="text-xs text-gray-500 text-center">
          Tap to open • Long press to delete
        </Text>
      </View>

      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        {selectedConversation && (() => {
          const otherUser = getOtherParticipant(selectedConversation);
          if (!otherUser) return null;

          return (
            <SafeAreaView className="flex-1">
              {/* Chat Header */}
              <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={closeChatModal} className="mr-3">
                  <Feather name="arrow-left" size={24} color="#1DA1F2" />
                </TouchableOpacity>
                <Image
                  source={{ uri: otherUser.profilePicture }}
                  className="size-10 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {otherUser.firstName} {otherUser.lastName}
                  </Text>
                  <Text className="text-gray-500 text-sm">@{otherUser.username}</Text>
                </View>
              </View>

              {/* Chat Messages Area */}
              <ScrollView className="flex-1 px-4 py-4">
                <View className="mb-4">
                  <Text className="text-center text-gray-400 text-sm mb-4">
                    This is the beginning of your conversation with {otherUser.firstName}
                  </Text>

                  {/* Conversation Messages */}
                  {(messages as Message[]).map((message) => {
                    const isFromCurrentUser = message.sender._id === currentUser?._id;
                    return (
                      <View
                        key={message._id}
                        className={`flex-row mb-3 ${isFromCurrentUser ? "justify-end" : ""}`}
                      >
                        {!isFromCurrentUser && (
                          <Image
                            source={{ uri: message.sender.profilePicture }}
                            className="size-8 rounded-full mr-2"
                          />
                        )}
                        <View className={`flex-1 ${isFromCurrentUser ? "items-end" : ""}`}>
                          <View
                            className={`rounded-2xl px-4 py-3 max-w-xs ${
                              isFromCurrentUser ? "bg-blue-500" : "bg-gray-100"
                            }`}
                          >
                            <Text className={isFromCurrentUser ? "text-white" : "text-gray-900"}>
                              {message.content}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-400 mt-1">
                            {formatDate(message.createdAt)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Message Input */}
              <View className="flex-row items-center px-4 py-3 border-t border-gray-100">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3 mr-3">
                  <TextInput
                    className="flex-1 text-base"
                    placeholder="Start a message..."
                    placeholderTextColor="#657786"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                  />
                </View>
                <TouchableOpacity
                  onPress={sendMessage}
                  className={`size-10 rounded-full items-center justify-center ${
                    newMessage.trim() ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                  <Feather name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          );
        })()}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;
