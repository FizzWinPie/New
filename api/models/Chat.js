import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  lastMessage: String
});

export default mongoose.model('Chat', chatSchema);
