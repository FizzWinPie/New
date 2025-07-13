import mongoose from 'mongoose';

const savedPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdAt: { type: Date, default: Date.now }
});

savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model('SavedPost', savedPostSchema);
