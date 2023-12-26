import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
export const writeComment = async (req, res) => {
  const { text, blogId, ishideProfile } = req.body;
  const userId = req.user;
  try {
    if (!text) {
      return res.status(400).json({ message: "Please write some comment." });
    }

    if (!blogId) {
      return res.status(400).json({ message: "Please select a blog first." });
    }

    const findBlog = await Blog.findOne({ _id: blogId });
    if (!findBlog) {
      return res.status(400).json({ message: "Blog not found." });
    }

    const comment = new Comment({
      text,
      blogId,
      userId,
      ishideProfile,
    });

    await comment.save();

    findBlog.comments.push(comment);

    await findBlog.save();

    res.status(201).json({ message: "Success", code: 201, data: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  const { blogId } = req.body;
  try {
    if (!blogId) {
      return res.status(400).json({ message: "Please provide blog id" });
    }
    const comments = await Comment.find({ blogId, commentType: "parent" }).sort(
      { publishedAt: -1 }
    );
    if (!comments) {
      res.status(404).json({ message: "Comment Not Found" });
    }
    res.status(200).json({ message: "Success", code: 200, data: comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  const { parentCommentId, text, blogId } = req.body;
  const userId = req.user;
  try {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(400).json({ message: "parent comment is not found" });
    }

    const reply = new Comment({
      text,
      userId,
      commentType: "children",
      blogId,
    });

    const newReply = await reply.save();
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "comment not found" });
    }

    const findComment = await Comment.findOne({
      _id: id,
      commentType: "children",
    });
    res.status(200).json({ message: "Success", code: 200, data: findComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id, parentCommentId } = req.body;
  const logedInUserId = req.user;

  try {
    const findComment = await Comment.findOne({ _id: id });
    if (!findComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const BlogPostAuthorId = await Blog.findOne({ _id: findComment.blogId });
    const commentUserId = new mongoose.Types.ObjectId(findComment.userId);
    const blogAuthorid = new mongoose.Types.ObjectId(BlogPostAuthorId);

    if (
      commentUserId.equals(logedInUserId) ||
      blogAuthorid.equals(logedInUserId)
    ) {
      if (findComment.commentType === "parent") {
        await Comment.deleteMany({ _id: { $in: findComment.replies } });
        await Comment.deleteOne({ _id: id });

        await Blog.updateOne(
          { _id: findComment.blogId },
          { $pull: { comments: id } }
        );
      } else {
        await Comment.findOneAndUpdate(
          { _id: parentCommentId },
          { $pull: { replies: id } },
          { new: true }
        );
        await Comment.deleteOne({ _id: id });
      }
    } else {
      res.status(400).json({ message: "unAuthorized" });
    }

    res
      .status(200)
      .json({ message: "Comment deleted successfully", code: 200 });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likeComment = async (req, res) => {
  const { commentId } = req.body;
  const likedUserId = req.user;

  try {
    if (!commentId) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    // Find the comment to check if the user has already liked it
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const hasLiked = existingComment.likes.includes(likedUserId);
    if (hasLiked) {
      const updatedComment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { likes: likedUserId } },
        { new: true }
      );

      res.status(200).json({
        message: "Comment unliked successfully",
        code: 200,
        status: "unlike",
      });
    } else {
      // If the user hasn't liked the comment, add the like
      const updatedComment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        { $addToSet: { likes: likedUserId } },
        { new: true }
      );

      res.status(200).json({
        message: "Comment liked successfully",
        code: 200,
        status: "like",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
