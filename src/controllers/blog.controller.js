import Blog from "../models/blog.model.js";
import { toLowerCaseSrting } from "../utils/toLowerCaseString.utils.js";
import { uniqueIdGenerator } from "../utils/uniqueIdGenerator.utils.js";
import User from "../models/user.model.js";

export const createBlog = async (req, res) => {
  const { title, tags, content, banner, des, category } = req.body;
  const logedInUser = req.user;

  try {
    if (!title || !tags || !content || !banner || !category) {
      return res.status(400).json({ message: "Please fill all forms." });
    }

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
      des,
      category,
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get blog
export const getBlog = async (req, res) => {
  const { page, categories } = req.body;
  let maxLimit = 40;
  let searchQuery;

  if (categories?.length > 0) {
    searchQuery = {
      draft: false,
      category: { $in: categories },
    };
  } else {
    searchQuery = { draft: false };
  }

  try {
    const blogs = await Blog.find(searchQuery)
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ createdAt: -1 })
      .select(
        "blog_id title des banner activity category  comments tags createdAt -_id"
      )
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
        createdAt: -1,
      })
      .select("blog_id title  createdAt -_id")
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
  const { category } = req.body;
  try {
    const blogs = await Blog.find({ category: category, draft: false })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select(
        "blog_id title des banner activity category tags publishedAt -_id"
      )
      .limit(5);
    if (!blogs) {
      return res.status(400).json({ message: "Sorry, No Blogs Found" });
    }

    res.status(200).json({ message: "Success", code: 200, data: blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//search blogs
export const searchController = async (req, res) => {
  const { searchValue } = req.body;

  try {
    // Use a regular expression to perform a case-insensitive search
    if (searchValue.length === 0) {
      return null;
    }
    const regex = new RegExp(searchValue, "i");

    // Search for blogs that match the search query in the 'content' field
    const blogs = await Blog.find({ title: regex })
      .populate(
        "author",
        "personal_info.profile_img personal_info.username personal_info.fullname -_id"
      )
      .sort({ publishedAt: -1 })
      .select("blog_id title des banner activity tags publishedAt -_id")
      .limit(10);
    const user = await User.find({ username: regex });

    // You can customize the search based on your model fields

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(500).json({ message: "Blogs not found" });
    }
    const blog = await Blog.findOne({ _id: id });
    if (!blog) {
      return res.status(404).json({ message: "blogs not found" });
    }

    res.status(200).json({ code: 200, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogByBlog_id = async (req, res) => {
  const { blog_id } = req.params;
  const incValue = 1;
  try {
    if (!blog_id) {
      return res.status(500).json({ message: "Blogs not found" });
    }
    const blog = await Blog.findOneAndUpdate(
      { blog_id: blog_id },
      { $inc: { "activity.total_reads": incValue } }
    )
      .populate(
        "author",
        "personal_info.username personal_info.fullname personal_info.profile_img"
      )
      .select(
        "title des content banner activity publishedAt blog_id tags comments"
      );
    if (!blog) {
      return res.status(404).json({ message: "blogs not found" });
    }

    const user = await User.findOneAndUpdate(
      { "personal_info.username": blog.author.personal_info.username },
      { $inc: { "account_info.total_reads": incValue } }
    );
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ code: 200, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  const loggedInUser = req.user;

  try {
    const findBlog = await Blog.findOne({ _id: blogId });

    if (!findBlog) {
      return res.status(404).json({ message: "Blog Not Found" });
    }

    if (findBlog.activity && Array.isArray(findBlog.activity.total_likes)) {
      const findIndex = findBlog.activity.total_likes.indexOf(loggedInUser);

      if (findIndex !== -1) {
        findBlog.activity.total_likes.splice(findIndex, 1);
      } else {
        findBlog.activity.total_likes.push(loggedInUser);
      }
      await findBlog.save();
      res.status(200).json({ code: 200, data: findBlog.activity.total_likes });
    } else {
      res.status(500).json({
        message: "Activity or total_likes is undefined or not an array",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
