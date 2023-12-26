import UserActivity from "../models/userActivity.model.js";
import User from "../models/user.model.js";

export const createUserActivity = async (req, res) => {
  const { userActivities, userId } = req.body;

  try {
    if (!userId || !userActivities) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userActivity = new UserActivity({
      userId,
      activity: userActivities.slice(0, 15),
    });

    await userActivity.save();
    await findUser.userActivity.push(userActivity);

    await findUser.save();
    res.status(201).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserActivity = async (req, res) => {
  const { userActivities, userId } = req.body;

  try {
    if (!userActivities || !userId) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the associated user activity record
    const userActivity = await UserActivity.findOne({ userId });

    if (!userActivity) {
      const newUserActivity = new UserActivity({
        userId,
        activity: userActivities,
      });
      await newUserActivity.save();
      return res.status(200).json({
        message: "User activity created successfully",
        data: newUserActivity.activity,
      });
    }

    const uniqueUserActivities = new Set([
      ...userActivities,
      ...userActivity.activity,
    ]);

    const combinedActivities = Array.from(uniqueUserActivities);

    const limitedUserActivities = combinedActivities.slice(0, 15);

    userActivity.activity = limitedUserActivities;

    await userActivity.save();

    res.status(200).json({
      message: "User activity updated successfully",
      data: limitedUserActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User id is not provided" });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "USer not found" });
    }

    const findActivity = await UserActivity.findById(findUser.ac);
  } catch (error) {
    res.sataus(500).json({ message: error.message });
  }
};
