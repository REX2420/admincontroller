"use client";

import { useState, useEffect } from "react";
import {
  getAllBlogsForAdmin,
  getBlogAnalyticsForAdmin,
  toggleBlogFeatured,
  deleteBlogAsAdmin,
  updateBlogStatus,
  getVendorsForBlogAdmin,
  getCategoriesForBlogAdmin,
  debugBlogCount,
} from "@/lib/database/actions/admin/blog/blog.actions";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  featuredImage: {
    url: string;
    public_id: string;
  };
  category: {
    _id: string;
    name: string;
  };
  subCategory?: {
    _id: string;
    name: string;
  };
  author: {
    _id: string;
    name: string;
    email: string;
  };
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  createdAt: string;
  publishedAt?: string;
  featured: boolean;
  tags: string[];
}

interface Analytics {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  archivedBlogs: number;
  featuredBlogs: number;
  totalViews: number;
  totalLikes: number;
  topVendors: Array<{ _id: string; name: string; count: number }>;
  categoryDistribution: Array<{ _id: string; count: number }>;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
}

interface Category {
  _id: string;
  name: string;
}

const AdminBlogsPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    featured: undefined as boolean | undefined,
    vendor: "",
    category: "",
  });

  useEffect(() => {
    // Debug call to check database
    debugBlogCount().then(result => {
      console.log("Debug result:", result);
    });
    
    fetchBlogs();
    fetchAnalytics();
    fetchVendors();
    fetchCategories();
  }, [filters]);

  const fetchBlogs = async () => {
    try {
      console.log("Fetching blogs with filters:", filters);
      const response = await getAllBlogsForAdmin(1, 50, filters);
      console.log("Blog fetch response:", response);
      if (response.success) {
        setBlogs(response.blogs);
        console.log("Blogs set successfully:", response.blogs.length, "blogs");
      } else {
        console.error("Failed to fetch blogs:", response.message);
        alert(`Failed to fetch blogs: ${response.message}`);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to fetch blogs due to an error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      console.log("Fetching blog analytics...");
      const response = await getBlogAnalyticsForAdmin();
      console.log("Analytics fetch response:", response);
      if (response.success && response.analytics) {
        setAnalytics(response.analytics);
        console.log("Analytics set successfully");
      } else {
        console.error("Failed to fetch analytics:", response.message);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const fetchVendors = async () => {
    try {
      console.log("Fetching vendors...");
      const response = await getVendorsForBlogAdmin();
      console.log("Vendors fetch response:", response);
      if (response.success) {
        setVendors(response.vendors);
        console.log("Vendors set successfully:", response.vendors.length, "vendors");
      } else {
        console.error("Failed to fetch vendors:", response.message);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const response = await getCategoriesForBlogAdmin();
      console.log("Categories fetch response:", response);
      if (response.success) {
        setCategories(response.categories);
        console.log("Categories set successfully:", response.categories.length, "categories");
      } else {
        console.error("Failed to fetch categories:", response.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleToggleFeatured = async (blogId: string) => {
    setUpdating(blogId);
    try {
      const response = await toggleBlogFeatured(blogId);
      if (response.success) {
        setBlogs(blogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, featured: response.featured } 
            : blog
        ));
        fetchAnalytics(); // Refresh analytics
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to toggle featured status");
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusUpdate = async (blogId: string, status: "draft" | "published" | "archived") => {
    setUpdating(blogId);
    try {
      const response = await updateBlogStatus(blogId, status);
      if (response.success) {
        setBlogs(blogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, status } 
            : blog
        ));
        fetchAnalytics(); // Refresh analytics
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (blogId: string, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) return;
    
    setDeleting(blogId);
    try {
      const response = await deleteBlogAsAdmin(blogId);
      if (response.success) {
        setBlogs(blogs.filter(blog => blog._id !== blogId));
        fetchAnalytics(); // Refresh analytics
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    } finally {
      setDeleting(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800 px-2 py-1 rounded text-xs";
      case "draft": return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs";
      case "archived": return "bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs";
      default: return "bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs";
    }
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      featured: undefined,
      vendor: "",
      category: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">Manage all blogs in the system</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={async () => {
              const result = await debugBlogCount();
              console.log("Manual debug result:", result);
              alert(`Debug: ${result.success ? `Found ${result.totalCount} blogs` : result.message}`);
            }}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            🐛 Debug Database
          </button>
          <Link href="/admin/dashboard/blogs/create">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md">
              + Create New Blog
            </button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold">{analytics.totalBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{analytics.publishedBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.draftBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-purple-600">{analytics.featuredBlogs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold">{analytics.totalLikes}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow border mb-8">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
            <select
              value={filters.featured === undefined ? "all" : filters.featured.toString()}
              onChange={(e) => setFilters({
                ...filters, 
                featured: e.target.value === "all" ? undefined : e.target.value === "true"
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All</option>
              <option value="true">Featured</option>
              <option value="false">Not Featured</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
            <select
              value={filters.vendor}
              onChange={(e) => setFilters({...filters, vendor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={resetFilters}
            className="text-orange-600 hover:text-orange-700 text-sm"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={blog.featuredImage.url}
                          alt={blog.title}
                          className="h-12 w-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {blog.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {blog.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{blog.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {blog.author.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {blog.author.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {blog.category.name}
                        </p>
                        {blog.subCategory && (
                          <p className="text-sm text-gray-500">
                            {blog.subCategory.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={blog.status}
                        onChange={(e) => handleStatusUpdate(blog._id, e.target.value as any)}
                        disabled={updating === blog._id}
                        className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(blog._id)}
                        disabled={updating === blog._id}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          blog.featured
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        } disabled:opacity-50`}
                      >
                        {updating === blog._id ? "..." : blog.featured ? "Featured" : "Not Featured"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <p>{blog.views} views</p>
                        <p>{blog.likes} likes</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link href={`/blog/${blog._id}`}>
                          <button className="text-blue-600 hover:text-blue-900 text-sm">
                            View
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deleting === blog._id}
                          className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                        >
                          {deleting === blog._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg font-medium mb-2">No blogs found</div>
                      <div className="text-sm">
                        {Object.values(filters).some(f => f && f !== "all") ? (
                          <>
                            No blogs match your current filters. Try clearing filters or adjusting your search criteria.
                            <br />
                            <button
                              onClick={resetFilters}
                              className="text-orange-600 hover:text-orange-700 mt-2 inline-block"
                            >
                              Clear all filters
                            </button>
                          </>
                        ) : (
                          "No blogs have been created yet. Create your first blog to get started."
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsPage; 