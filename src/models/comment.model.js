import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    ishideProfile:{
      type:Boolean,
      default:false
    },
    commentType:{
      type:String,
      default:"parent"
    },
    
    text: { type: String, required: true },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
