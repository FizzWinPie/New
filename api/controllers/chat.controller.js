import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      userIDs: tokenUserId,
    }).sort({ updatedAt: -1 }); // Optional: newest first

    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find(
          (id) => id.toString() !== tokenUserId
        );
        const receiver = await User.findById(receiverId).select("id username avatar");
        return {
          ...chat.toObject(),
          receiver,
        };
      })
    );

    res.status(200).json(populatedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // oldest to newest
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Mark as read
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get chat" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const receiverId = req.body.receiverId;

  if (tokenUserId === receiverId) {
    return res.status(400).json({ message: "You cannot message yourself" });
  }

  try {
    // Check for existing chat
    const existingChat = await Chat.findOne({
      userIDs: { $all: [tokenUserId, receiverId] },
    });

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = new Chat({
      userIDs: [tokenUserId, receiverId],
      seenBy: [tokenUserId],
    });

    const savedChat = await newChat.save();
    res.status(200).json(savedChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add chat" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    });

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.seenBy = [tokenUserId];
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark chat as read" });
  }
};
