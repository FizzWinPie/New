import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: String,
  price: Number,
  images: [String],
  address: String,
  city: String,
  bedroom: Number,
  bathroom: Number,
  latitude: String,
  longitude: String,
  type: { type: String, enum: ['buy', 'rent'] },
  property: { type: String, enum: ['apartment', 'house', 'condo', 'land'] },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postDetail: { type: mongoose.Schema.Types.ObjectId, ref: 'PostDetail' },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedPost' }]
});

export default mongoose.model('Post', postSchema);
