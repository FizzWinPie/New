import mongoose from 'mongoose';

const postDetailSchema = new mongoose.Schema({
  desc: String,
  utilities: String,
  pet: String,
  income: String,
  size: Number,
  school: Number,
  bus: Number,
  restaurant: Number,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', unique: true }
});

export default mongoose.model('PostDetail', postDetailSchema);
