import { prisma } from "./prisma";

// Ensure we only run database operations on server side
if (typeof window !== "undefined") {
  throw new Error(
    "Database operations can only be performed on the server side",
  );
}

// Helper function to get or create blog post by slug
async function getOrCreateBlogPost(blogSlug: string) {
  if (!prisma) throw new Error("Database not available");

  // Try to find existing blog post
  let blogPost = await prisma.blogPost.findUnique({
    where: { slug: blogSlug },
    select: { id: true },
  });

  // If blog post doesn't exist, create it
  if (!blogPost) {
    // Import the blog post data from MDX
    const { getBlogPostBySlug } = await import("./data");
    const mdxPost = await getBlogPostBySlug(blogSlug);

    if (!mdxPost) {
      throw new Error("Blog post not found in MDX files");
    }

    // Create the blog post in database
    blogPost = await prisma.blogPost.create({
      data: {
        slug: mdxPost.slug,
        title: mdxPost.title,
        excerpt: mdxPost.excerpt,
        content: mdxPost.content,
        featured: mdxPost.featured || false,
        readingTime: mdxPost.readingTime,
        tags: mdxPost.tags || [],
        published: true,
      },
      select: { id: true },
    });
  }

  return blogPost;
}

// Simple blog interaction functions - no user restrictions
export async function likeBlogPost(blogSlug: string) {
  if (!prisma) throw new Error("Database not available");

  // Get or create the blog post
  const blogPost = await getOrCreateBlogPost(blogSlug);

  // Add a like using the actual blog post ID
  return await prisma.blogLike.create({
    data: { blogId: blogPost.id },
  });
}

export async function dislikeBlogPost(blogSlug: string) {
  if (!prisma) throw new Error("Database not available");

  // Get or create the blog post
  const blogPost = await getOrCreateBlogPost(blogSlug);

  // Add a dislike using the actual blog post ID
  return await prisma.blogDislike.create({
    data: { blogId: blogPost.id },
  });
}

export async function getBlogReactionCounts(blogSlug: string) {
  if (!prisma) throw new Error("Database not available");

  // Try to find existing blog post
  const blogPost = await prisma.blogPost.findUnique({
    where: { slug: blogSlug },
    select: { id: true },
  });

  // If blog post doesn't exist in database, return zero counts
  if (!blogPost) {
    return { likes: 0, dislikes: 0 };
  }

  const [likes, dislikes] = await Promise.all([
    prisma.blogLike.count({ where: { blogId: blogPost.id } }),
    prisma.blogDislike.count({ where: { blogId: blogPost.id } }),
  ]);

  return { likes, dislikes };
}
