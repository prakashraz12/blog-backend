import User from "../models/user.model.js";
import { nanoid } from "nanoid";

export const generatorUserName = async (email) => {
  let userName = email.split("@")[0];
  try {
    let isUserNameUnique = await User.findOne({
      "personal_info.username": userName,
    });
    if (isUserNameUnique) {
      userName += nanoid().substring(0, 4);
    } else {
      userName += nanoid().substring(0, 5);
    }
    return userName;
  } catch (error) {
    res.status(500).json({ message: `username ${error}` });
  }
};
