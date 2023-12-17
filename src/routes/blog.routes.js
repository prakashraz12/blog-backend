import express from "express";
import { createBlog, getBlog, getBlogByBlog_id, getBlogById, getBogsByCategory, likeBlog, searchController, trendingBlogs } from "../controllers/blog.controller.js";
import { authenticateUser } from "../middleware/authUser.middleware.js";

const router = express.Router();

router.post("/create",  authenticateUser, createBlog);
router.post("/get/blogs", getBlog);
router.get("/get/trending/blogs",  trendingBlogs);
router.post("/get/category/blog", getBogsByCategory);
router.post("/get/search", searchController);
router.get("/get/blog/:id", getBlogById);
router.get("/get/blog_id/:blog_id", getBlogByBlog_id);
router.post("/like",authenticateUser, likeBlog);



export default router;