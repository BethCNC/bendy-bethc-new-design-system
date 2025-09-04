/**
 * Blog Service - Server-side blog data utilities
 * Provides higher-level data access patterns for blog functionality
 * Optimized for server-side rendering and API routes
 */

import { 
  BlogPost, 
  BlogQueryOptions, 
  BlogCategory, 
  FeaturedBlogPost 
} from '@/lib/types/blog';
import { 
  fetchPublishedPosts, 
  fetchScheduledPosts, 
  fetchFuturePosts,
  testBlogConnection 
} from '@/lib/notion/blog';

/**
 * Blog Service Class - Singleton pattern for consistent data access
 */
class BlogService {
  private static instance: BlogService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  
  private constructor() {}
  
  static getInstance(): BlogService {
    if (!BlogService.instance) {
      BlogService.instance = new BlogService();
    }
    return BlogService.instance;
  }

  /**
   * Get cached data or fetch fresh data
   */
  private async getCachedOrFetch<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttlMinutes: number = 5
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data as T;
    }
    
    // Fetch fresh data
    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: ttlMinutes * 60 * 1000 // Convert to milliseconds
    });
    
    return data;
  }

  /**
   * Clear cache for specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get blog posts with caching
   */
  async getBlogPosts(options: BlogQueryOptions = {}): Promise<BlogPost[]> {
    const cacheKey = `posts_${JSON.stringify(options)}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => fetchPublishedPosts(options),
      5 // 5 minute cache
    );
  }

  /**
   * Get featured posts for homepage
   */
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    return this.getCachedOrFetch(
      `featured_posts_${limit}`,
      () => fetchPublishedPosts({
        featuredOnly: true,
        publishedOnly: true,
        scheduledOnly: true,
        limit,
        sortDirection: 'descending'
      }),
      10 // 10 minute cache for featured posts
    );
  }

  /**
   * Get recent posts for sidebar/widgets
   */
  async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    return this.getCachedOrFetch(
      `recent_posts_${limit}`,
      () => fetchPublishedPosts({
        publishedOnly: true,
        scheduledOnly: true,
        limit,
        sortDirection: 'descending'
      }),
      3 // 3 minute cache
    );
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(category: string, limit?: number): Promise<BlogPost[]> {
    const cacheKey = `category_${category}_${limit || 'all'}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => fetchPublishedPosts({
        categories: [category],
        publishedOnly: true,
        scheduledOnly: true,
        limit
      }),
      5 // 5 minute cache
    );
  }

  /**
   * Get posts by medical condition
   */
  async getPostsByCondition(condition: string, limit?: number): Promise<BlogPost[]> {
    const cacheKey = `condition_${condition}_${limit || 'all'}`;
    return this.getCachedOrFetch(
      cacheKey,
      () => fetchPublishedPosts({
        medicalConditions: [condition],
        publishedOnly: true,
        scheduledOnly: true,
        limit
      }),
      5 // 5 minute cache
    );
  }

  /**
   * Get blog categories with post counts
   */
  async getBlogCategories(): Promise<BlogCategory[]> {
    return this.getCachedOrFetch(
      'blog_categories',
      async () => {
        // Fetch all published posts
        const allPosts = await fetchPublishedPosts({ 
          publishedOnly: true, 
          scheduledOnly: true 
        });
        
        // Count posts per category
        const categoryMap = new Map<string, { count: number; color: string }>();
        
        allPosts.forEach(post => {
          post.categories.forEach(category => {
            const existing = categoryMap.get(category.name);
            categoryMap.set(category.name, {
              count: existing ? existing.count + 1 : 1,
              color: category.color
            });
          });
        });
        
        // Convert to BlogCategory array
        const categoryArray: BlogCategory[] = Array.from(categoryMap.entries()).map(
          ([name, data]) => ({
            name,
            count: data.count,
            color: data.color
          })
        );
        
        // Sort by count (descending)
        return categoryArray.sort((a, b) => b.count - a.count);
      },
      15 // 15 minute cache for categories
    );
  }

  /**
   * Get medical conditions mentioned in blog posts
   */
  async getMedicalConditions(): Promise<BlogCategory[]> {
    return this.getCachedOrFetch(
      'medical_conditions',
      async () => {
        const allPosts = await fetchPublishedPosts({ 
          publishedOnly: true, 
          scheduledOnly: true 
        });
        
        const conditionMap = new Map<string, { count: number; color: string }>();
        
        allPosts.forEach(post => {
          post.medicalConditions.forEach(condition => {
            const existing = conditionMap.get(condition.name);
            conditionMap.set(condition.name, {
              count: existing ? existing.count + 1 : 1,
              color: condition.color
            });
          });
        });
        
        const conditionArray: BlogCategory[] = Array.from(conditionMap.entries()).map(
          ([name, data]) => ({
            name,
            count: data.count,
            color: data.color
          })
        );
        
        return conditionArray.sort((a, b) => b.count - a.count);
      },
      15 // 15 minute cache
    );
  }

  /**
   * Search posts (server-side filtering)
   */
  async searchPosts(searchTerm: string, limit?: number): Promise<BlogPost[]> {
    const cacheKey = `search_${searchTerm}_${limit || 'all'}`;
    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        const allPosts = await fetchPublishedPosts({ 
          publishedOnly: true, 
          scheduledOnly: true 
        });
        
        const searchLower = searchTerm.toLowerCase();
        let filtered = allPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.summary.toLowerCase().includes(searchLower) ||
          post.categories.some(cat => cat.name.toLowerCase().includes(searchLower)) ||
          post.medicalConditions.some(condition => condition.name.toLowerCase().includes(searchLower))
        );

        if (limit) {
          filtered = filtered.slice(0, limit);
        }

        return filtered;
      },
      2 // Short cache for search results
    );
  }

  /**
   * Get related posts based on categories and medical conditions
   */
  async getRelatedPosts(post: BlogPost, limit: number = 4): Promise<BlogPost[]> {
    const cacheKey = `related_${post.id}_${limit}`;
    return this.getCachedOrFetch(
      cacheKey,
      async () => {
        // Get all posts except the current one
        const allPosts = await fetchPublishedPosts({ 
          publishedOnly: true, 
          scheduledOnly: true 
        });
        
        const otherPosts = allPosts.filter(p => p.id !== post.id);
        
        // Calculate relevance scores
        const scoredPosts = otherPosts.map(otherPost => {
          let score = 0;
          
          // Score for shared categories
          const sharedCategories = post.categories.filter(cat =>
            otherPost.categories.some(otherCat => otherCat.name === cat.name)
          );
          score += sharedCategories.length * 3;
          
          // Score for shared medical conditions
          const sharedConditions = post.medicalConditions.filter(condition =>
            otherPost.medicalConditions.some(otherCondition => 
              otherCondition.name === condition.name
            )
          );
          score += sharedConditions.length * 2;
          
          // Slight boost for more recent posts
          const daysDiff = Math.abs(
            new Date(post.date).getTime() - new Date(otherPost.date).getTime()
          ) / (1000 * 60 * 60 * 24);
          if (daysDiff < 30) {
            score += 1;
          }
          
          return { post: otherPost, score };
        });
        
        // Sort by score and return top posts
        return scoredPosts
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .map(item => item.post);
      },
      10 // 10 minute cache for related posts
    );
  }

  /**
   * Get scheduled posts (admin use)
   */
  async getScheduledPosts(): Promise<BlogPost[]> {
    // No caching for editorial data
    return await fetchScheduledPosts();
  }

  /**
   * Get future posts (admin use)
   */
  async getFuturePosts(): Promise<BlogPost[]> {
    // No caching for editorial data
    return await fetchFuturePosts();
  }

  /**
   * Test blog database connection
   */
  async testConnection(): Promise<boolean> {
    return await testBlogConnection();
  }

  /**
   * Get blog statistics
   */
  async getBlogStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    futurePosts: number;
    categories: number;
    conditions: number;
  }> {
    return this.getCachedOrFetch(
      'blog_stats',
      async () => {
        const [published, scheduled, future, categories, conditions] = await Promise.all([
          this.getBlogPosts({ publishedOnly: true, scheduledOnly: true }),
          this.getScheduledPosts(),
          this.getFuturePosts(),
          this.getBlogCategories(),
          this.getMedicalConditions()
        ]);

        return {
          totalPosts: published.length + scheduled.length + future.length,
          publishedPosts: published.length,
          scheduledPosts: scheduled.length,
          futurePosts: future.length,
          categories: categories.length,
          conditions: conditions.length
        };
      },
      30 // 30 minute cache for stats
    );
  }
}

// Export BlogService class for type checking
export { BlogService };

// Export singleton instance
export const blogService = BlogService.getInstance();

// Export individual functions for convenience
export const {
  getBlogPosts,
  getFeaturedPosts,
  getRecentPosts,
  getPostsByCategory,
  getPostsByCondition,
  getBlogCategories,
  getMedicalConditions,
  searchPosts,
  getRelatedPosts,
  getScheduledPosts,
  getFuturePosts,
  testConnection,
  getBlogStats,
  clearCache
} = blogService;

// Add convenience methods that match our page requirements
export const getLatestPosts = (options?: { limit?: number }) => 
  blogService.getBlogPosts({ ...options, publishedOnly: true, scheduledOnly: true });

export const getFeaturedPost = () => 
  blogService.getFeaturedPosts().then(posts => posts[0] || null);

export const getCategories = () => 
  blogService.getBlogCategories();

export const getPostBySlug = async (slug: string) => {
  const allPosts = await blogService.getBlogPosts({ publishedOnly: true, scheduledOnly: true });
  return allPosts.find(post => post.slug === slug) || null;
};