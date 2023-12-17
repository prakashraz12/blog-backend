import express from "express";
import { getUserProfile, googleAuth, signIn, signUp } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn );
router.post("/google-auth", googleAuth);
router.get("/:id", getUserProfile);

export default router;