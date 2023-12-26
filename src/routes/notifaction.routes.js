import express from "express";
import { createNotification } from "../controllers/notifaction.controller.js";
import { authenticateUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.post("/create",createNotification);


export default router;