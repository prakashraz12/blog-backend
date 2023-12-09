import express from "express";
import { createBlog, getBlog, getBogsByCategory, trendingBlogs } from "../controllers/blog.controller.js";
import { authenticateUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.post("/create",  authenticateUser, createBlog);
router.post("/get/blogs", getBlog);
router.get("/get/trending/blogs",  trendingBlogs);
router.post("/get/category/blog", getBogsByCategory)



export default router;