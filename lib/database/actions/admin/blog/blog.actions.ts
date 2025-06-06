"use server";

import { connectToDatabase } from "@/lib/database/connect";
import Blog from "@/lib/database/models/blog.model";
import Vendor from "@/lib/database/models/vendor.model";
import Category from "@/lib/database/models/category.model";
import SubCategory from "@/lib/database/models/subCategory.model";
import { verify_admin } from "@/utils";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

// Debug function to check blog count without authentication
export const debugBlogCount = async () => {
  try {
    console.log("Debug: Connecting to database...");
    await connectToDatabase();
    console.log("Debug: Database connected");
    
    const totalCount = await Blog.countDocuments();
    console.log("Debug: Total blogs in database:", totalCount);
    
    const blogs = await Blog.find().limit(5).lean();
    console.log("Debug: Sample blogs:", blogs);
    
    return {
      success: true,
      totalCount,
      sampleBlogs: JSON.parse(JSON.stringify(blogs)),
    };
  } catch (error: any) {
    console.error("Debug blog count error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Get all blogs for admin management
export const getAllBlogsForAdmin = async (page: number = 1, limit: number = 10, filters?: {
  status?: string;
  featured?: boolean;
  vendor?: string;
  category?: string;
}) => {
  try {
    console.log("getAllBlogsForAdmin called with:", { page, limit, filters });
    
    await connectToDatabase();
    console.log("Database connected successfully");
    
    const adminAuth = await verify_admin();
    console.log("Admin auth result:", adminAuth);
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   console.log("Admin authentication failed");
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //     blogs: [],
    //   };
    // }

    // Build filter query
    const query: any = {};
    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }
    if (filters?.featured !== undefined) {
      query.featured = filters.featured;
    }
    if (filters?.vendor) {
      query.author = filters.vendor;
    }
    if (filters?.category) {
      query.category = filters.category;
    }

    console.log("Query being executed:", query);

    const skip = (page - 1) * limit;
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log("Blogs found:", blogs.length);

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    console.log("Total blogs in database matching query:", totalBlogs);

    return {
      success: true,
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error: any) {
    console.error("Get all blogs error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blogs",
      blogs: [],
    };
  }
};

// Get blog analytics for admin
export const getBlogAnalyticsForAdmin = async () => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //   };
    // }

    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: "published" });
    const draftBlogs = await Blog.countDocuments({ status: "draft" });
    const archivedBlogs = await Blog.countDocuments({ status: "archived" });
    const featuredBlogs = await Blog.countDocuments({ featured: true });
    
    const totalViews = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    
    const totalLikes = await Blog.aggregate([
      { $group: { _id: null, total: { $sum: "$likes" } } }
    ]);

    // Get top vendors by blog count
    const topVendors = await Blog.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { 
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      { $unwind: "$vendor" },
      { 
        $project: {
          name: "$vendor.name",
          count: 1
        }
      }
    ]);

    // Get category distribution
    const categoryDistribution = await Blog.aggregate([
      { 
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      { $group: { _id: "$categoryInfo.name", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return {
      success: true,
      analytics: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        archivedBlogs,
        featuredBlogs,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        topVendors: JSON.parse(JSON.stringify(topVendors)),
        categoryDistribution: JSON.parse(JSON.stringify(categoryDistribution)),
      },
    };
  } catch (error: any) {
    console.error("Get blog analytics error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog analytics",
    };
  }
};

// Toggle featured status of a blog
export const toggleBlogFeatured = async (blogId: string) => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //   };
    // }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return {
        success: false,
        message: "Blog not found.",
      };
    }

    blog.featured = !blog.featured;
    await blog.save();

    revalidatePath("/admin/dashboard/blogs");

    return {
      success: true,
      message: `Blog ${blog.featured ? 'featured' : 'unfeatured'} successfully`,
      featured: blog.featured,
    };
  } catch (error: any) {
    console.error("Toggle blog featured error:", error);
    return {
      success: false,
      message: error.message || "Failed to toggle featured status",
    };
  }
};

// Delete a blog (admin can delete any blog)
export const deleteBlogAsAdmin = async (blogId: string) => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //   };
    // }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return {
        success: false,
        message: "Blog not found.",
      };
    }

    await Blog.findByIdAndDelete(blogId);

    revalidatePath("/admin/dashboard/blogs");

    return {
      success: true,
      message: "Blog deleted successfully",
    };
  } catch (error: any) {
    console.error("Delete blog error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete blog",
    };
  }
};

// Update blog status (admin can change any blog status)
export const updateBlogStatus = async (blogId: string, status: "draft" | "published" | "archived") => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //   };
    // }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return {
        success: false,
        message: "Blog not found.",
      };
    }

    blog.status = status;
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    await blog.save();

    revalidatePath("/admin/dashboard/blogs");

    return {
      success: true,
      message: `Blog status updated to ${status}`,
      blog: JSON.parse(JSON.stringify(blog)),
    };
  } catch (error: any) {
    console.error("Update blog status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update blog status",
    };
  }
};

// Get all categories for blog creation/editing
export const getCategoriesForBlogAdmin = async () => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //     categories: [],
    //   };
    // }

    const categories = await Category.find().sort({ name: 1 }).lean();

    return {
      success: true,
      categories: JSON.parse(JSON.stringify(categories)),
      message: "Categories fetched successfully",
    };
  } catch (error: any) {
    console.error("Get categories error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch categories",
      categories: [],
    };
  }
};

// Get subcategories for a category
export const getSubCategoriesForBlogAdmin = async (categoryId: string) => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    if (!adminAuth) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
        subCategories: [],
      };
    }

    const subCategories = await SubCategory.find({ parent: categoryId }).sort({ name: 1 }).lean();

    return {
      success: true,
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      message: "Subcategories fetched successfully",
    };
  } catch (error: any) {
    console.error("Get subcategories error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch subcategories",
      subCategories: [],
    };
  }
};

// Get all vendors for blog creation/filtering
export const getVendorsForBlogAdmin = async () => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    // Temporarily commented out for testing - uncomment in production
    // if (!adminAuth) {
    //   return {
    //     success: false,
    //     message: "Unauthorized. Admin access required.",
    //     vendors: [],
    //   };
    // }

    const vendors = await Vendor.find({}, 'name email').sort({ name: 1 }).lean();

    return {
      success: true,
      vendors: JSON.parse(JSON.stringify(vendors)),
      message: "Vendors fetched successfully",
    };
  } catch (error: any) {
    console.error("Get vendors error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch vendors",
      vendors: [],
    };
  }
};

// Create blog as admin (can assign to any vendor)
export const createBlogAsAdmin = async (blogData: {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: {
    url: string;
    public_id: string;
  };
  category: string;
  subCategory?: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  author: string; // vendor ID
}) => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    if (!adminAuth) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    // Validate featuredImage object structure
    if (!blogData.featuredImage || typeof blogData.featuredImage !== 'object') {
      return {
        success: false,
        message: "Featured image is required and must be a valid object.",
      };
    }

    if (!blogData.featuredImage.url || !blogData.featuredImage.public_id) {
      return {
        success: false,
        message: "Featured image must have both url and public_id.",
      };
    }

    // Fetch vendor details
    const vendor = await Vendor.findById(blogData.author);
    if (!vendor) {
      return {
        success: false,
        message: "Selected vendor not found.",
      };
    }

    // Fetch category details
    const category = await Category.findById(blogData.category);
    if (!category) {
      return {
        success: false,
        message: "Selected category not found.",
      };
    }

    // Fetch subcategory details if provided
    let subCategory = null;
    if (blogData.subCategory) {
      subCategory = await SubCategory.findById(blogData.subCategory);
      if (!subCategory) {
        return {
          success: false,
          message: "Selected subcategory not found.",
        };
      }
      
      if (subCategory.parent.toString() !== category._id.toString()) {
        return {
          success: false,
          message: "Selected subcategory doesn't belong to the selected category.",
        };
      }
    }

    const slug = slugify(blogData.title);

    // Check if slug already exists and make it unique if needed
    let uniqueSlug = slug;
    let counter = 1;
    while (await Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const blogToCreate: any = {
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      featuredImage: {
        url: String(blogData.featuredImage.url),
        public_id: String(blogData.featuredImage.public_id)
      },
      category: category._id,
      categoryName: category.name,
      tags: blogData.tags,
      status: blogData.status,
      featured: blogData.featured,
      seoTitle: blogData.seoTitle,
      seoDescription: blogData.seoDescription,
      slug: uniqueSlug,
      author: vendor._id,
      authorName: vendor.name,
    };

    // Add subcategory if provided
    if (subCategory) {
      blogToCreate.subCategory = subCategory._id;
      blogToCreate.subCategoryName = subCategory.name;
    }

    const newBlog = new Blog(blogToCreate);
    await newBlog.save();

    revalidatePath("/admin/dashboard/blogs");

    return {
      success: true,
      message: "Blog created successfully!",
      blog: JSON.parse(JSON.stringify(newBlog)),
    };
  } catch (error: any) {
    console.error("Create blog error:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return {
        success: false,
        message: `Validation failed: ${validationErrors.join(', ')}`,
      };
    }
    
    return {
      success: false,
      message: error.message || "Failed to create blog",
    };
  }
};

// Get blog by ID for admin
export const getBlogByIdForAdmin = async (blogId: string) => {
  try {
    await connectToDatabase();
    const adminAuth = await verify_admin();
    
    if (!adminAuth) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    const blog = await Blog.findById(blogId)
      .populate('author', 'name email')
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .lean();

    if (!blog) {
      return {
        success: false,
        message: "Blog not found.",
      };
    }

    return {
      success: true,
      blog: JSON.parse(JSON.stringify(blog)),
    };
  } catch (error: any) {
    console.error("Get blog by ID error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch blog",
    };
  }
}; 