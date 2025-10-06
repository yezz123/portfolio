import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface MDXFrontMatter {
  title: string;
  date: string;
  excerpt: string;
  featured?: boolean;
  tags?: string[];
  image?: string;
  venue?: string;
  description?: string;
  slidesUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface MDXContent extends MDXFrontMatter {
  slug: string;
  content: string;
  readingTime: number;
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Get all MDX files from a directory (server-side only)
export function getAllMDXFiles(directory: string): MDXContent[] {
  const fullPath = path.join(contentDirectory, directory);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(fullPath);
  const allPostsData = fileNames
    .filter((name) => name.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullFilePath = path.join(fullPath, fileName);
      const fileContents = fs.readFileSync(fullFilePath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        content,
        readingTime: calculateReadingTime(content),
        ...data,
      } as MDXContent;
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get a single MDX file (server-side only)
export function getMDXFile(directory: string, slug: string): MDXContent | null {
  const fullPath = path.join(contentDirectory, directory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    readingTime: calculateReadingTime(content),
    ...data,
  } as MDXContent;
}

// Get all blog posts
export function getAllBlogPosts(): MDXContent[] {
  return getAllMDXFiles("blog");
}

// Get a single blog post
export function getBlogPost(slug: string): MDXContent | null {
  return getMDXFile("blog", slug);
}

// Get featured blog posts
export function getFeaturedBlogPosts(limit: number = 3): MDXContent[] {
  return getAllBlogPosts()
    .filter((post) => post.featured)
    .slice(0, limit);
}

// Get all talks
export function getAllTalks(): MDXContent[] {
  return getAllMDXFiles("talks");
}

// Get a single talk
export function getTalk(slug: string): MDXContent | null {
  return getMDXFile("talks", slug);
}
