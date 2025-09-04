/**
 * Notion API utilities for blog CMS integration
 * Updated to match ACTUAL database schema from Beth's Blog Posts database
 * Database ID: 23586edc-ae2c-80da-bb7a-ed2798991679
 * 
 * Features:
 * - Scheduled posting via Post Date field (posts are published when Post Date <= now)
 * - Fallback to Created Date for posts without Post Date
 * - Query filtering for published, featured, and scheduled posts
 * - Future posts management for editorial planning
 */

import { Client } from '@notionhq/client';
import { 
  BlogPost, 
  BlogQueryOptions, 
  BlogCategory, 
  NotionBlogPageProperties,
  BlogTag,
  FeaturedBlogPost 
} from '../types/blog';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Actual Blog Posts Database ID
const BLOG_DATABASE_ID = '23586edc-ae2c-80da-bb7a-ed2798991679';

/**
 * Transform raw Notion page to BlogPost interface
 */
function transformNotionPageToBlogPost(page: any): BlogPost {
  const properties = page.properties as NotionBlogPageProperties;
  
  return {
    id: page.id,
    title: properties.Title?.title?.[0]?.plain_text || '',
    slug: properties.Slug?.rich_text?.[0]?.plain_text || '',
    // Use Post Date if available, otherwise fall back to Created Date
    date: properties['Post Date']?.date?.start || properties['Created Date']?.created_time || '',
    // Store the original Post Date for scheduling logic
    postDate: properties['Post Date']?.date?.start,
    categories: properties.Category?.multi_select?.map((cat): BlogTag => ({
      name: cat.name,
      color: cat.color,
    })) || [],
    summary: properties.Summary?.rich_text?.[0]?.plain_text || '',
    coverImage: properties['Cover Image']?.files?.[0]?.file?.url || 
                properties['Cover Image']?.files?.[0]?.external?.url,
    featured: properties.Featured?.checkbox || false,
    content: properties.Content?.rich_text?.[0]?.plain_text,
    author: properties.Author?.rich_text?.[0]?.plain_text,
    readingTime: properties['Reading Time']?.number,
    relatedPostIds: properties['Related Posts']?.relation?.map(rel => rel.id) || [],
    instagramImages: properties['Instagram Images']?.files?.map(file => 
      file.file?.url || file.external?.url || ''
    ).filter(Boolean) || [],
    status: properties.Status?.status?.name || 'Draft',
    published: ['Published', 'Posted', 'Idea'].includes(properties.Status?.status?.name || ''),
    metaDescription: properties['Meta Description']?.rich_text?.[0]?.plain_text,
    medicalConditions: properties['Medical Conditions']?.multi_select?.map((condition): BlogTag => ({
      name: condition.name,
      color: condition.color,
    })) || [],
    contentId: page.id,
  };
}

/**
 * Fetch all published blog posts
 */
export async function fetchPublishedPosts(options: BlogQueryOptions = {}): Promise<BlogPost[]> {
  const {
    publishedOnly = true,
    featuredOnly = false,
    scheduledOnly = false,
    categories = [],
    medicalConditions = [],
    limit,
    sortDirection = 'descending'
  } = options;

  try {
    const filters: any[] = [];
    
    if (publishedOnly) {
      // Support current DB status options - including 'Idea' for development
      filters.push({
        or: [
          { property: 'Status', status: { equals: 'Published' } },
          { property: 'Status', status: { equals: 'Posted' } },
          { property: 'Status', status: { equals: 'Idea' } }
        ]
      } as any);
    }
    
    if (featuredOnly) {
      filters.push({
        property: 'Featured',
        checkbox: { equals: true }
      });
    }
    
    if (categories.length > 0) {
      filters.push({
        property: 'Category',
        multi_select: {
          contains: categories[0]
        }
      });
    }
    
    // Filter by scheduled posts (Post Date <= now)
    if (scheduledOnly) {
      const now = new Date().toISOString();
      filters.push({
        property: 'Post Date',
        date: {
          on_or_before: now
        }
      });
    }

    const query: any = {
      database_id: BLOG_DATABASE_ID,
      sorts: [
        // Primary sort by Post Date when available
        {
          property: 'Post Date',
          direction: sortDirection
        },
        // Secondary sort by Created Date as fallback
        {
          property: 'Created Date',
          direction: sortDirection
        }
      ]
    };

    if (filters.length > 0) {
      query.filter = filters.length === 1 
        ? filters[0]
        : { and: filters };
    }

    if (limit) {
      query.page_size = limit;
    }

    const response = await notion.databases.query(query);
    return response.results.map(transformNotionPageToBlogPost);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    throw error;
  }
}

/**
 * Fetch posts that are ready to be published (Post Date <= now and Status = Published)
 */
export async function fetchScheduledPosts(): Promise<BlogPost[]> {
  return fetchPublishedPosts({
    publishedOnly: true,
    scheduledOnly: true,
    sortDirection: 'ascending' // Oldest first for processing
  });
}

/**
 * Fetch posts scheduled for future publication (Post Date > now and Status = Published) 
 */
export async function fetchFuturePosts(): Promise<BlogPost[]> {
  try {
    const now = new Date().toISOString();
    const response = await notion.databases.query({
      database_id: BLOG_DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Status',
            status: { equals: 'Published' }
          },
          {
            property: 'Post Date',
            date: {
              after: now
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Post Date',
          direction: 'ascending'
        }
      ]
    });
    
    return response.results.map(transformNotionPageToBlogPost);
  } catch (error) {
    console.error('Error fetching future posts:', error);
    throw error;
  }
}

/**
 * Test connection to blog database
 */
export async function testBlogConnection(): Promise<boolean> {
  try {
    await notion.databases.retrieve({ database_id: BLOG_DATABASE_ID });
    return true;
  } catch (error) {
    console.error('Blog database connection test failed:', error);
    return false;
  }
}