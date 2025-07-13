import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  chatIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});

export default mongoose.model('User', userSchema);
