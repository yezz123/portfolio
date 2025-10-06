"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";
import Prism from "prismjs";

// Import Prism.js languages
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-kotlin";
import "prismjs/components/prism-docker";
import "prismjs/components/prism-git";
import "prismjs/components/prism-nginx";
import "prismjs/components/prism-apacheconf";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-graphql";
import "prismjs/components/prism-http";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-ini";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-regex";
import "prismjs/components/prism-markup-templating";

const contentDirectory = path.join(process.cwd(), "content");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  readingTime: number;
}

export interface Talk {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  slidesUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  tags: string[];
}

// Load all blog posts from MDX files
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(contentDirectory, "blog");
  const fileNames = fs.readdirSync(blogDir);

  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(blogDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const htmlContent = await mdxToHtml(content);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        content: htmlContent,
        tags: data.tags || [],
        featured: data.featured || false,
        image: data.image || undefined,
        readingTime: Math.ceil(content.split(/\s+/).length / 200),
      };
    }),
  );

  return allPostsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Load a specific blog post
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const fullPath = path.join(contentDirectory, "blog", `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = await mdxToHtml(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      content: htmlContent,
      tags: data.tags || [],
      featured: data.featured || false,
      image: data.image,
      readingTime: Math.ceil(content.split(/\s+/).length / 200),
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return undefined;
  }
}

// Get featured blog posts
export async function getFeaturedBlogPosts(
  limit: number = 3,
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.featured).slice(0, limit);
}

// Load all talks from MDX files
export async function getAllTalks(): Promise<Talk[]> {
  const talksDir = path.join(contentDirectory, "talks");

  if (!fs.existsSync(talksDir)) {
    return [];
  }

  const fileNames = fs.readdirSync(talksDir);

  const allTalksData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(talksDir, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      id,
      title: data.title,
      date: data.date,
      venue: data.venue,
      description: data.description,
      slidesUrl: data.slidesUrl,
      videoUrl: data.videoUrl,
      imageUrl: data.imageUrl,
      tags: data.tags || [],
    };
  });

  return allTalksData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Load a specific talk
export async function getTalk(id: string): Promise<Talk | undefined> {
  try {
    const fullPath = path.join(contentDirectory, "talks", `${id}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      id,
      title: data.title,
      date: data.date,
      venue: data.venue,
      description: data.description,
      slidesUrl: data.slidesUrl,
      videoUrl: data.videoUrl,
      imageUrl: data.imageUrl,
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error loading talk ${id}:`, error);
    return undefined;
  }
}

// Convert MDX content to HTML
export async function mdxToHtml(mdxContent: string): Promise<string> {
  const processedContent = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(html, { sanitize: false })
    .process(mdxContent);

  let htmlContent = processedContent.toString();

  // Process images to use Next.js Image component or fix paths
  htmlContent = htmlContent.replace(
    /<img([^>]*?)src="([^"]*?)"([^>]*?)>/g,
    (match, before, src, after) => {
      // If it's a local image path, ensure it starts with /
      if (src.startsWith("/images/")) {
        return `<img${before}src="${src}"${after} class="blog-image">`;
      }
      // If it's a relative path, make it absolute
      if (!src.startsWith("http") && !src.startsWith("/")) {
        return `<img${before}src="/${src}"${after} class="blog-image">`;
      }
      return match;
    },
  );

  // Process code blocks with syntax highlighting using Prism.js
  htmlContent = htmlContent.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code) => {
      // Clean up the code content for display
      const cleanCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, " ");

      // Apply syntax highlighting using Prism.js
      let highlightedCode = cleanCode;
      try {
        // Check if the language is supported by Prism.js
        if (Prism.languages[lang]) {
          highlightedCode = Prism.highlight(
            cleanCode,
            Prism.languages[lang],
            lang,
          );
        }
      } catch (error) {
        console.warn(`Failed to highlight code for language ${lang}:`, error);
        highlightedCode = cleanCode;
      }

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-block-lang">${lang}</span>
            <button class="code-block-copy" data-code="${encodeURIComponent(cleanCode)}">
              Copy
            </button>
          </div>
          <pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>
        </div>
      `;
    },
  );

  // Handle code blocks without language specification
  htmlContent = htmlContent.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (match, code) => {
      const cleanCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&nbsp;/g, " ");

      // No syntax highlighting for code blocks without language
      const highlightedCode = cleanCode;

      return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <button class="code-block-copy" data-code="${encodeURIComponent(cleanCode)}">
              Copy
            </button>
          </div>
          <pre><code>${highlightedCode}</code></pre>
        </div>
      `;
    },
  );

  // Note: Copy button functionality is handled by CodeBlockScript component

  return htmlContent;
}
