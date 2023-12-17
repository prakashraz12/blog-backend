import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
    },
    des: {
      type: String,
      maxlength: 200,
      // required: true
    },
    content: {
      type: [],
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    category:{
      type:String,
      required:true
    },
    activity: {
      total_likes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      total_comments: [
       {
        type:mongoose.Types.ObjectId,
        ref:"Comment"
       }
      ],
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

export default mongoose.model("Blog", blogSchema);
