/**
 * Blog data types for Notion CMS integration
 * Based on the database schema from notion_cms_blog_workflow.mdc
 */

// Raw Notion property types
export interface NotionRichText {
  plain_text: string;
  href?: string;
}

export interface NotionFile {
  file?: { url: string };
  external?: { url: string };
}

export interface NotionMultiSelect {
  name: string;
  color: string;
}

export interface NotionDate {
  start: string;
  end?: string;
}

export interface NotionPerson {
  name: string;
  avatar_url?: string;
}

// Raw Notion page properties as they come from the API - ACTUAL SCHEMA
export interface NotionBlogPageProperties {
  Title: {
    title: NotionRichText[];
  };
  Slug: {
    rich_text: NotionRichText[];
  };
  'Created Date': {
    created_time: string;
  };
  'Post Date': {
    date?: NotionDate;
  };
  Category: {
    multi_select: NotionMultiSelect[];
  };
  Summary: {
    rich_text: NotionRichText[];
  };
  'Cover Image': {
    files: NotionFile[];
  };
  Featured: {
    checkbox: boolean;
  };
  Content: {
    rich_text: NotionRichText[];
  };
  Author: {
    rich_text: NotionRichText[];
  };
  'Reading Time': {
    number?: number;
  };
  'Related Posts': {
    relation: { id: string }[];
  };
  'Instagram Images': {
    files: NotionFile[];
  };
  Status: {
    status: {
      name: string;
      color: string;
    };
  };
  'Meta Description': {
    rich_text: NotionRichText[];
  };
  'Medical Conditions': {
    multi_select: NotionMultiSelect[];
  };
}

// Processed/normalized blog post interface for React components
export interface BlogPost {
  /** Notion page ID */
  id: string;
  /** Post title */
  title: string;
  /** URL slug */
  slug: string;
  /** Publication date (from Post Date or Created Date) */
  date: string;
  /** Scheduled post date (from Post Date field) */
  postDate?: string;
  /** Category chips (was "tags" in workflow) */
  categories: BlogTag[];
  /** Post summary/excerpt */
  summary: string;
  /** Cover image URL */
  coverImage?: string;
  /** Is featured post */
  featured: boolean;
  /** Post content (for short content) */
  content?: string;
  /** Author name */
  author?: string;
  /** Reading time in minutes */
  readingTime?: number;
  /** Related post IDs */
  relatedPostIds: string[];
  /** Instagram gallery images */
  instagramImages: string[];
  /** Publication status (from Status field) */
  status: string;
  /** Is published (derived from status) */
  published: boolean;
  /** Meta description for SEO */
  metaDescription?: string;
  /** Medical conditions tags */
  medicalConditions: BlogTag[];
  /** Notion page ID for full content rendering */
  contentId: string;
}

// Blog tag/category interface
export interface BlogTag {
  name: string;
  color: string;
}

// Blog query filters
export interface BlogQueryOptions {
  /** Only published posts (checks Status field) */
  publishedOnly?: boolean;
  /** Only featured posts */
  featuredOnly?: boolean;
  /** Only posts scheduled for current date or earlier */
  scheduledOnly?: boolean;
  /** Filter by specific categories */
  categories?: string[];
  /** Filter by medical conditions */
  medicalConditions?: string[];
  /** Limit number of results */
  limit?: number;
  /** Sort direction */
  sortDirection?: 'ascending' | 'descending';
}

// Blog API response types
export interface BlogPostsResponse {
  posts: BlogPost[];
  hasMore: boolean;
  nextCursor?: string;
}

// Blog categories summary
export interface BlogCategory {
  name: string;
  count: number;
  color: string;
}

// Featured post data for hero section
export interface FeaturedBlogPost extends BlogPost {
  featured: true;
}