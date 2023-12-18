import express from "express";
import { authenticateUser } from "../middleware/authUser.middleware.js";
import { getComments, writeComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/comment/write",  authenticateUser,writeComment );
router.post("/comment/get",getComments)




export default router;