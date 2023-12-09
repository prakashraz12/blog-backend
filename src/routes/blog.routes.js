import express from "express";
import { createBlog, getBlog, getBogsByCategory, trendingBlogs } from "../controllers/blog.controller.js";
import { authenticateUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.post("/create",  authenticateUser, createBlog);
router.post("/get/blogs", getBlog);
router.get("/get/trending/blogs",  trendingBlogs);
router.get("/get/search/blog", getBogsByCategory)



export default router;