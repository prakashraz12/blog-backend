import Blog from "../models/blog.model.js";
import { toLowerCaseSrting } from "../utils/toLowerCaseString.utils.js";
import { uniqueIdGenerator } from "../utils/uniqueIdGenerator.utils.js";
import User from "../models/user.model.js";

export const createBlog = async (req, res) => {
  const { title, tags, content, banner } = req.body;
  const logedInUser = req.user;

  try {
    // if (!title || !tags || !content || !banner) {
    //   return res.status(400).json({ message: "Please fill all forms." });
    // }

    //make tags unifrom means all tages in loweercase.
    const uniformTags = toLowerCaseSrting(tags);
    //bog id

    const blog_id = uniqueIdGenerator(title);
    const blogPost = new Blog({
      title,
      blog_id: blog_id,
      tags: uniformTags,
      content,
      banner,
      author: logedInUser,
    });

    await blogPost.save();

    const user = await User.findOneAndUpdate(
      { _id: logedInUser },
      {
        $inc: { "account_info.total_posts": 1 },
        $push: { blogs: blogPost._id },
      }
    );
    await user.save();
    res.status(201).json({ message: "Success", code: 201, data: blogPost });
  } catch (error) {}
};

//get blog
export const getBlog = async (req, res) => {
  const { page, searchValue } = req.body;
  let maxLimit = 10;
  let searchQuery = { draft: false };
  if (searchValue) {
    // searchQuery = { tags: , draft: false };
  }
  try {
    const blogs = await Blog.find(searchQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    res.status(200).json({ message: "Success", code: 200, data: blogs });
    if (!blogs) {
      return res.status(400).json({ message: "Blog not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//trending-blogs

export const trendingBlogs = async (req, res) => {
  const { page } = req.body;
  let maxLimit = 5;
  try {
    const blogs = await Blog.find({ draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({
        "activity.total_read": -1,
        "activity.total_likes": -1,
        publishedAt: -1,
      })
      .select("blog_id title publishedAt -_id")
      .limit(maxLimit);

    res.status(200).json({ message: "Success", code: 200, data: blogs });
    if (!blogs) {
      return res.status(400).json({ message: "Blog not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getBogsByCategory = async (req, res) => {
  const { tags } = req.body;
  const searchQuery = { tags, draft: false };
  try {
    const blogs = await Blog.find(searchQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .limit(5);

    res.status(200).json({ message: "Success", code: 200, data: blogs });
  } catch (error) {}
};

//search blogs 
export const searchController = async (req,res)=>{
  const {searchValue} = req.body;
  try {
    const blogs = await Blog.find()
  } catch (error) {
    
  }
}