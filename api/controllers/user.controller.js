import bcrypt from "bcrypt";
import User from '../models/User.js';
import SavedPost from '../models/SavedPost.js';
import Post from '../models/Post.js';
import Chat from '../models/Chat.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized to update" });
  }

  try {
    const updateData = { ...inputs };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (avatar) {
      updateData.avatar = avatar;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    const { password: userPassword, ...rest } = updatedUser.toObject();
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized to delete" });
  }

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await SavedPost.findOne({ userId: tokenUserId, postId });

    if (savedPost) {
      await SavedPost.findByIdAndDelete(savedPost._id);
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await SavedPost.create({ userId: tokenUserId, postId });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save post" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;

  try {
    const userPosts = await Post.find({ userId: tokenUserId });

    const saved = await SavedPost.find({ userId: tokenUserId }).populate('post');

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get profile posts" });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const number = await Chat.countDocuments({
      userIDs: { $in: [tokenUserId] },
      seenBy: { $nin: [tokenUserId] }
    });

    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get notifications" });
  }
};
