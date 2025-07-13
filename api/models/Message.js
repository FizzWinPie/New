import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
