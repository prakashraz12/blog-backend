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
    category: {
      type: String,
      required: true,
    },
    activity: {
      total_likes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    draft: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps:true,
  }
);

export default mongoose.model("Blog", blogSchema);
