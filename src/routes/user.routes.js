import express from "express";
import { getUserProfile, googleAuth, signIn, signUp } from "../controllers/user.controller.js";
import { createUserActivity, updateUserActivity } from "../controllers/userActivity.controller.js";
import { authenticateUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn );
router.post("/google-auth", googleAuth);
router.get("/:id", getUserProfile);
router.post("/activity", createUserActivity);
router.post("/activity/update", updateUserActivity);
router.put("/update/password", authenticateUser, updateUserActivity);

export default router;