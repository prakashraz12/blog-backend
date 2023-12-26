import express from "express";
import { authenticateUser } from "../middleware/authUser.middleware.js";
import {
  deleteComment,
  getCommentById,
  getComments,
  likeComment,
  replyToComment,
  writeComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/comment/write", authenticateUser, writeComment);
router.post("/comment/get", getComments);
router.post("/comment/replied", authenticateUser, replyToComment);
router.get("/comment/id/:id", getCommentById);
router.post("/comment/delete", authenticateUser, deleteComment);
router.post("/comment/like", authenticateUser, likeComment);

export default router;
