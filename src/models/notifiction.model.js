import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  notificationType: {
    type: String,
    required: true,
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
  sendUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  endUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isRead:{
    type:Boolean,
    defaut:false
  }
}, {timestamps:true});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
