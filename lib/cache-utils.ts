/**
 * Cache Utilities for VibeCart Admin
 * Helper functions for granular cache invalidation from admin operations
 */

/**
 * Base cache invalidation function
 */
async function invalidateCache(type: string, tag?: string): Promise<void> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const body = tag 
      ? { type: 'tag', tag } 
      : { type };
      
    await fetch(`${baseUrl}/api/cache/invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    console.log(`Cache invalidated: ${tag || type}`);
  } catch (error) {
    console.error(`Failed to invalidate cache (${tag || type}):`, error);
    // Don't throw - cache invalidation failures shouldn't break the main operation
  }
}

/**
 * Product-specific cache invalidations
 */
export const ProductCacheInvalidation = {
  // Only invalidate featured products cache
  featuredProducts: () => invalidateCache('tag', 'featured_products'),
  
  // Only invalidate new arrivals cache
  newArrivals: () => invalidateCache('tag', 'new_arrival_products'),
  
  // Only invalidate top selling products cache
  topSelling: () => invalidateCache('tag', 'top_selling_products'),
  
  // Invalidate all product-related caches (use sparingly)
  allProducts: () => invalidateCache('products'),
  
  // Invalidate specific product cache
  singleProduct: () => invalidateCache('tag', 'product'),
};

/**
 * Banner-specific cache invalidations
 */
export const BannerCacheInvalidation = {
  // Only invalidate website banners
  websiteBanners: () => invalidateCache('tag', 'website_banners'),
  
  // Only invalidate app banners
  appBanners: () => invalidateCache('tag', 'app_banners'),
  
  // Invalidate both banner types (for delete operations where type is unknown)
  allBanners: async () => {
    await invalidateCache('tag', 'website_banners');
    await invalidateCache('tag', 'app_banners');
  },
  
  // Invalidate home page banners section
  homeBanners: () => invalidateCache('tag', 'home_banners'),
};

/**
 * Category-specific cache invalidations
 */
export const CategoryCacheInvalidation = {
  // Invalidate all category-related caches
  categories: () => invalidateCache('categories'),
  
  // Invalidate specific category cache tags
  featuredCategories: () => invalidateCache('tag', 'featured_categories'),
  allCategories: () => invalidateCache('tag', 'all_categories'),
  categoriesWithCounts: () => invalidateCache('tag', 'categories_with_counts'),
};

/**
 * Subcategory-specific cache invalidations
 */
export const SubcategoryCacheInvalidation = {
  // Invalidate all subcategory-related caches
  subcategories: () => invalidateCache('subcategories'),
  
  // Invalidate specific subcategory cache tags
  popularSubcategories: () => invalidateCache('tag', 'popular_subcategories'),
  subcategoriesWithCounts: () => invalidateCache('tag', 'subcategories_with_counts'),
  navigationSubcategories: () => invalidateCache('tag', 'subcategories_navigation'),
};

/**
 * Blog-specific cache invalidations
 */
export const BlogCacheInvalidation = {
  // Invalidate all blog-related caches
  blogs: () => invalidateCache('blogs'),
  
  // Invalidate specific blog cache tags
  featuredBlogs: () => invalidateCache('tag', 'featured_blogs_home'),
  publishedBlogs: () => invalidateCache('tag', 'published_blogs_home'),
  blogCategories: () => invalidateCache('tag', 'blog_categories'),
};

/**
 * Footer-specific cache invalidations
 */
export const FooterCacheInvalidation = {
  // Invalidate all footer-related caches
  footer: () => invalidateCache('footer'),
  
  // Invalidate specific footer cache tags
  footerData: () => invalidateCache('tag', 'footer_data'),
  footerNavigation: () => invalidateCache('tag', 'footer_navigation'),
  footerSocialMedia: () => invalidateCache('tag', 'footer_social_media'),
};

/**
 * Home page cache invalidations
 */
export const HomeCacheInvalidation = {
  // Invalidate entire home page cache
  homePage: () => invalidateCache('home'),
  
  // Invalidate specific home page sections
  homeProducts: () => invalidateCache('tag', 'home_products'),
  homeBanners: () => invalidateCache('tag', 'home_banners'),
  homeBlogs: () => invalidateCache('tag', 'home_blogs'),
};

/**
 * Comprehensive cache invalidation (use sparingly)
 */
export const ComprehensiveCacheInvalidation = {
  // Nuclear option - invalidate everything
  everything: () => invalidateCache('all'),
  
  // Invalidate entire sections
  allProducts: () => invalidateCache('products'),
  allCategories: () => invalidateCache('categories'),
  allSubcategories: () => invalidateCache('subcategories'),
  allBanners: () => invalidateCache('banners'),
  allBlogs: () => invalidateCache('blogs'),
  allFooter: () => invalidateCache('footer'),
}; 