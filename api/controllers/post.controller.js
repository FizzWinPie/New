import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import PostDetail from "../models/PostDetails.js";
import SavedPost from "../models/SavedPost.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const filter = {
      ...(query.city && { city: query.city }),
      ...(query.type && { type: query.type }),
      ...(query.property && { property: query.property }),
      ...(query.bedroom && { bedroom: parseInt(query.bedroom) }),
      price: {
        $gte: parseInt(query.minPrice) || 0,
        $lte: parseInt(query.maxPrice) || 10000000,
      },
    };

    const posts = await Post.find(filter);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await Post.findById(id)
      .populate("postDetail")
      .populate("userId", "username avatar");

    let userId = null;
    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = payload.id;
      } catch (err) {
        userId = null;
      }
    }

    let saved = null;
    if (userId) {
      saved = await SavedPost.findOne({ postId: id, userId });
    }

    res.status(200).json({ ...post.toObject(), isSaved: !!saved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get single post" });
  }
};

export const addPost = async (req, res) => {
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = new Post({
      ...postData,
      userId: tokenUserId,
    });

    const savedPost = await newPost.save();

    const detail = new PostDetail({
      ...postDetail,
      postId: savedPost._id,
    });

    await detail.save();

    savedPost.postDetail = detail._id;
    await savedPost.save();

    res.status(200).json(savedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const updateData = req.body;

  try {
    const post = await Post.findById(id);
    if (!post || post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    const updated = await Post.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);
    if (!post || post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized" });
    }

    await Post.findByIdAndDelete(id);
    await PostDetail.findOneAndDelete({ postId: id });

    res.status(200).json({ message: "Post Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
