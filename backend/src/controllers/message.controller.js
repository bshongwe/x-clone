import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

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

    if (!conversation.participants.some((id) => id.equals(req.user._id))) {
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

    if (!recipientId) {
      return res.status(400).json({ error: "recipientId is required" });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({
        error: "Cannot send a message to yourself"
      });
    }

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

    const conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [req.user._id, recipientId] } },
      { $setOnInsert: { participants: [req.user._id, recipientId] } },
      { upsert: true, new: true }
    );

    const message = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      content: content.trim(),
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    await message.populate(
      "sender",
      "firstName lastName username profilePicture"
    );

    res.status(201).json(message);
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

    const conversation = await Conversation.findById(
      conversationId
    ).session(session);
    if (!conversation) {
      await session.abortTransaction();
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!conversation.participants.some((id) => id.equals(req.user._id))) {
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
