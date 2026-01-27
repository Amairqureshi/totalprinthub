import { client } from "./client";
import { PricingTier } from "@/lib/pricing/calculator";

/**
 * Sanity product type
 */
export interface SanityProduct {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription: string;
  longDescription: any; // Block content
  keywords: string[];
  category: {
    _id: string;
    title: string;
    slug: { current: string };
  };
  basePrice: number;
  pricingTiers: PricingTier[];
  featuredImage: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  productImages: Array<{
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  }>;
  hasBackSide?: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  schemaJSON?: string;
  publishedAt: string;
}

/**
 * Sanity blog post type
 */
export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  body: any; // Block content
  tags: string[];
  category: string;
  featuredImage: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  author: string;
  publishedAt: string;
}

/**
 * Get all products
 */
export async function getAllProducts(): Promise<SanityProduct[]> {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    keywords,
    category->{
      _id,
      title,
      slug
    },
    basePrice,
    pricingTiers,
    featuredImage{
      asset->{
        _id,
        url
      },
      alt
    },
    productImages[]{
      asset->{
        _id,
        url
      },
      alt
    },
    hasBackSide,
    metaTitle,
    metaDescription,
    canonicalUrl,
    schemaJSON,
    publishedAt
  }`;

  return await client.fetch(query);
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    keywords,
    category->{
      _id,
      title,
      slug
    },
    basePrice,
    pricingTiers,
    featuredImage{
      asset->{
        _id,
        url
      },
      alt
    },
    productImages[]{
      asset->{
        _id,
        url
      },
      alt
    },
    hasBackSide,
    metaTitle,
    metaDescription,
    canonicalUrl,
    schemaJSON,
    publishedAt
  }`;

  return await client.fetch(query, { slug });
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categorySlug: string): Promise<SanityProduct[]> {
  const query = `*[_type == "product" && category->slug.current == $slug] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    featuredImage{
      asset->{
        _id,
        url
      },
      alt
    },
    basePrice,
    category->{
      _id,
      title,
      slug
    }
  }`;

  return await client.fetch(query, { slug: categorySlug });
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<SanityBlogPost[]> {
  const query = `*[_type == "blogPost"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    summary,
    tags,
    category,
    featuredImage{
      asset->{
        _id,
        url
      },
      alt
    },
    author,
    publishedAt
  }`;

  return await client.fetch(query);
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<SanityBlogPost | null> {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    summary,
    body,
    tags,
    category,
    featuredImage{
      asset->{
        _id,
        url
      },
      alt
    },
    metaTitle,
    metaDescription,
    canonicalUrl,
    author,
    publishedAt
  }`;

  return await client.fetch(query, { slug });
}
/**
 * Get all categories
 */
export async function getAllCategories(): Promise<any[]> {
  const query = `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "productCount": count(*[_type == "product" && references(^._id)])
  }`;

  return await client.fetch(query);
}
