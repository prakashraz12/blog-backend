import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

export const writeComment = async (req, res) => {
  const { text, blogId } = req.body;
  const userId = req.user;
  try {
    if (!text) {
      return res.status(400).json({ message: "Please write some comment." });
    }

    if (!blogId) {
      return res.status(400).json({ message: "Please select a blog first." });
    }
    // Use mongoose.Types.ObjectId to convert blogId to ObjectId

    const findBlog = await Blog.findOne({ _id: blogId });
    if (!findBlog) {
      return res.status(400).json({ message: "Blog not found." });
    }

    const comment = new Comment({
      text,
      blogId,
      userId,
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
    const comments = await Comment.find({ blogId }).sort({ publishedAt: -1 });
    if (!comments) {
      res.status(404).json({ message: "Comment Not Found" });
    }
    res.status(200).json({ message: "Success", code: 200, data: comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const replyToComment = async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.id);
    const reply = new Comment({
      text: req.body.text,
    });

    const newReply = await reply.save();
    parentComment.replies.push(newReply._id);
    await parentComment.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
