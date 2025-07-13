import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const message = new Message({
      text,
      chatId,
      userId: tokenUserId,
    });

    await message.save();

    chat.seenBy = [tokenUserId]; // reset seenBy to just the sender
    chat.lastMessage = text;
    chat.messages.push(message._id); // optional, if storing message references
    await chat.save();

    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
