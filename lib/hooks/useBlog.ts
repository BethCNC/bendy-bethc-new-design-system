'use client';

import { useState, useEffect, useCallback } from 'react';
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
 * Hook to fetch published blog posts with optional filtering
 */
export function useBlogPosts(options: BlogQueryOptions = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await fetchPublishedPosts(options);
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  };
}

/**
 * Hook to fetch featured blog posts specifically
 */
export function useFeaturedPosts(limit?: number) {
  return useBlogPosts({ 
    featuredOnly: true, 
    publishedOnly: true,
    scheduledOnly: true,
    limit 
  });
}

/**
 * Hook to fetch the most recent blog posts
 */
export function useRecentPosts(limit: number = 5) {
  return useBlogPosts({ 
    publishedOnly: true,
    scheduledOnly: true,
    limit,
    sortDirection: 'descending'
  });
}

/**
 * Hook to fetch posts by category
 */
export function usePostsByCategory(category: string, limit?: number) {
  return useBlogPosts({
    categories: [category],
    publishedOnly: true,
    scheduledOnly: true,
    limit
  });
}

/**
 * Hook to fetch posts by medical condition
 */
export function usePostsByCondition(condition: string, limit?: number) {
  return useBlogPosts({
    medicalConditions: [condition],
    publishedOnly: true,
    scheduledOnly: true,
    limit
  });
}

/**
 * Hook to fetch scheduled posts (for admin/editorial use)
 */
export function useScheduledPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await fetchScheduledPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching scheduled posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scheduled posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  };
}

/**
 * Hook to fetch future posts (for editorial planning)
 */
export function useFuturePosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await fetchFuturePosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching future posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch future posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  };
}

/**
 * Hook to get blog categories with post counts
 */
export function useBlogCategories() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all published posts to calculate category counts
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
      categoryArray.sort((a, b) => b.count - a.count);
      
      setCategories(categoryArray);
    } catch (err) {
      console.error('Error fetching blog categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blog categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
}

/**
 * Hook to test blog database connection
 */
export function useBlogConnection() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const isConnected = await testBlogConnection();
      setConnected(isConnected);
    } catch (err) {
      console.error('Error testing blog connection:', err);
      setError(err instanceof Error ? err.message : 'Failed to test connection');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return {
    connected,
    loading,
    error,
    testConnection
  };
}

/**
 * Hook for searching blog posts (client-side filtering for now)
 */
export function useSearchPosts(searchTerm: string) {
  const { posts: allPosts, loading, error } = useBlogPosts();
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPosts([]);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.summary.toLowerCase().includes(searchLower) ||
      post.categories.some(cat => cat.name.toLowerCase().includes(searchLower)) ||
      post.medicalConditions.some(condition => condition.name.toLowerCase().includes(searchLower))
    );

    setFilteredPosts(filtered);
  }, [searchTerm, allPosts]);

  return {
    posts: filteredPosts,
    loading,
    error,
    totalResults: filteredPosts.length
  };
}

export interface UseBlogOptions {
  category?: string | null;
  page?: number;
  limit?: number;
}

export function useBlog(options: UseBlogOptions = {}) {
  const { category = null, limit = 6 } = options;

  // Base data hooks
  const { posts: recentPosts, loading: loadingRecent, error: errorRecent, refetch: refetchRecent } = useRecentPosts(limit);
  const { posts: featuredPosts, loading: loadingFeatured, error: errorFeatured } = useFeaturedPosts(1);
  const { categories, loading: loadingCategories, error: errorCategories } = useBlogCategories();

  // Client-side category filter if provided
  const filteredPosts = category
    ? recentPosts.filter(p => p.categories.some(c => c.name === category))
    : recentPosts;

  const loading = loadingRecent || loadingFeatured || loadingCategories;
  const error = errorRecent || errorFeatured || errorCategories;

  return {
    posts: filteredPosts,
    featuredPost: featuredPosts[0] || undefined,
    categories: categories.map(c => c.name),
    loading,
    error,
    refetch: refetchRecent,
  };
}