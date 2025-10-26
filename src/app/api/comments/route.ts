import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateBlogPost } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogSlug = searchParams.get("blogId");

    if (!blogSlug) {
      return NextResponse.json(
        { error: "Blog ID is required" },
        { status: 400 },
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 },
      );
    }

    // Get or create the blog post by slug
    const blogPost = await getOrCreateBlogPost(blogSlug);

    // Get comments with user data
    const comments = await prisma.comment.findMany({
      where: {
        blogId: blogPost.id, // Use the actual database ID, not the slug
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      content,
      blogId,
      parentId,
      userId,
      userEmail,
      userName,
      userAvatar,
    } = await request.json();

    if (!content || !blogId || !userId) {
      return NextResponse.json(
        { error: "Content, blogId, and userId are required" },
        { status: 400 },
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 },
      );
    }

    // Get or create the blog post by slug
    const blogPost = await getOrCreateBlogPost(blogId);

    // First try to find user by ID
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser && userEmail) {
      // If not found by ID, try to find by email
      dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (dbUser) {
        // If found by email, update the ID to match the current user
        dbUser = await prisma.user.update({
          where: { email: userEmail },
          data: { id: userId },
        });
      }
    }

    if (!dbUser) {
      // If still not found, create a new user
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail || "",
          name: userName || "Anonymous",
          avatar: userAvatar || "",
        },
      });
    } else {
      // Update existing user with latest info
      dbUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: userEmail || dbUser.email,
          name: userName || dbUser.name,
          avatar: userAvatar || dbUser.avatar,
        },
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        blogId: blogPost.id, // Use the actual database ID, not the slug
        userId: dbUser.id,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
