import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  activity: [
    {
      type: String,
    },
  ],
});

const UserActivity = mongoose.model("UserActivity", userActivitySchema);
export default UserActivity;
