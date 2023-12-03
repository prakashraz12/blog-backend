import User from "../models/user.model.js";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import {
  comparePassword,
  hashedPassword,
} from "../utils/bcrypt.password.utils.js";

import { tokenGenrerator } from "../utils/tokenGenerator.utils.js";
import { generatorUserName } from "../utils/userNameGen.utils.js";

//sign-up user
export const signUp = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return res
        .status(500)
        .json({ message: "Please fill all required fields" });
    }

    //check if user already in datbase or not
    const isUserAlreadyExist = await User.findOne({
      "personal_info.email": email,
    });

    //if user already in database throw 11000 error to user.
    if (isUserAlreadyExist) {
      return res.status(403).json({ message: "User already exist." });
    }

    //hased password function
    const hasedPassword = await hashedPassword(password);

    //username genreator function
    const userName = await generatorUserName(email);

    //
    const user = new User({
      personal_info: {
        email,
        password: hasedPassword,
        fullname: fullname,
        username: userName,
      },
    });

    //save user data in database
    await user.save();
    //access_token_generator;
    const access_token = await tokenGenrerator(user._id);
    const formattedData = {
      access_token,
      profile_img: user.personal_info.profile_img,
      email: user.personal_info.email,
      fullName: user.personal_info.fullname,
      userName: user.personal_info.username,
    };
    //response messgae
    res
      .status(201)
      .json({ message: "Success", code: 201, data: formattedData });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//signin user

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(500)
        .json({ message: "Please Provide Required Fields." });
    }

    // Find user
    const findUser = await User.findOne({ "personal_info.email": email });

    if (!findUser) {
      return res.status(403).json({ message: "Invalid User Details." });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      findUser.personal_info.password
    );

    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid User Details." });
    }
    const access_token = await tokenGenrerator(findUser._id);

    const formatedData = {
      access_token,
      id: findUser._id,
      email: findUser.personal_info.email,
      profile_img: findUser.personal_info.profile_img,
      username: findUser.personal_info.username,
    };
    res.status(200).json({ message: "Success", code: 200, data: formatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//googleAuth

export const googleAuth = async (req, res) => {
  //get token from fE that provide by firebase
  let { access_token } = req.body;

  try {
    //send token to firebase that extract user deatils by token
    const data = await getAuth().verifyIdToken(access_token);

    //find user if already exists in database
    const { email, name, picture } = data;

    const findUser = await User.findOne({
      "personal_info.email": email,
    });

    //if already in databse
    if (findUser) {
      if (!findUser.google_auth) {
        return res.status(403).json({
          message: "This is email already exist please login with password.",
        });
      }

      //gen token
      const access_token = await tokenGenrerator(findUser._id);

      //forntted data
      const formatedData = {
        access_token,
        id: findUser._id,
        email: findUser.personal_info.email,
        profile_img: findUser.personal_info.profile_img,
        username: findUser.personal_info.username,
      };

      //response if already have data
      return res
        .status(200)
        .json({ message: "Success", code: 200, data: formatedData });
    } else {
      //gen username
      let username = await generatorUserName(email);

      //
      const user = new User({
        personal_info: {
          email,
          username,
          fullname: name,
          profile_img: picture,
        },
        google_auth: true,
      });

      //
      let access_token = await tokenGenrerator(user._id);
      //
      await user.save();

      const formatedData = {
        access_token,
        id: user._id,
        email: user.personal_info.email,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
      };

      //
      res
        .status(201)
        .json({ code: 201, message: "success", data: formatedData });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//thank you!!
