import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const isParticipant = (conversation, userId) => {
  return conversation.participants.some((id) => id.equals(userId));
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "firstName lastName username profilePicture")
      .populate({
        path: "lastMessage",
        select: "content createdAt sender",
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error in getConversations:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!isParticipant(conversation, req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "firstName lastName username profilePicture")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Message content is required" });
    }

    if (!isValidObjectId(recipientId)) {
      return res.status(400).json({ error: "Invalid recipient ID" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      content: content.trim(),
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "firstName lastName username profilePicture"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteConversation = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { conversationId } = req.params;

    if (!isValidObjectId(conversationId)) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId).session(session);
    if (!conversation) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!isParticipant(conversation, req.user._id)) {
      await session.abortTransaction();
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Message.deleteMany({ conversationId }, { session });
    await Conversation.findByIdAndDelete(conversationId, { session });

    await session.commitTransaction();
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in deleteConversation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};
