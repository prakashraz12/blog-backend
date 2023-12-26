import { io, userSocketMap } from "../../src/index.js";
import Notification from "../models/notifiction.model.js";
import User from "../models/user.model.js";
import { notificationPattern } from "../utils/notificationPattern.utils.js";

export const createNotification = async (req, res) => {
  const { notificationType, blogId, endUserId, sendUserId } = req.body;
  const userId = req.user;

  try {
    if (!notificationType || !blogId || !endUserId) {
      return res.status(400).json({ message: "Please provide data" });
    }

    const { personal_info } =
      await User.findById(sendUserId).select("personal_info");
    const senderFullname = personal_info?.fullname;

    const newNotification = new Notification({
      notificationType,
      blogId,
      sendUserId: userId,
      endUserId,
    });

    await newNotification.save();

    const endUser = await User.findById(endUserId);

    if (!endUser) {
      return res.status(404).json({ message: "End user not found" });
    }

    endUser.notifications.push(newNotification._id);

    await endUser.save();

    const endUserSocketId = userSocketMap.get(endUserId);
    if (endUserSocketId) {
      const notification = notificationPattern(
        notificationType,
        senderFullname
      );
      io.to(endUserSocketId).emit("notification", { notification });
    }

    res.status(201).json({ message: "Notification created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
