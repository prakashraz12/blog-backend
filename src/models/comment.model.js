import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  
},{
  timestamps: {
    createdAt: "publishedAt",
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
