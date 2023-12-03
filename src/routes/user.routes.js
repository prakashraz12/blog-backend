import express from "express";
import { googleAuth, signIn, signUp } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn );
router.post("/google-auth", googleAuth)

export default router;