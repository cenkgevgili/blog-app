import { staticPosts } from "@/lib/posts";
import { BlogPostClient } from "./client";

// Static params for export - only static posts can be pre-rendered
export function generateStaticParams() {
  return staticPosts.map((post) => ({
    slug: post.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Check if it's a static post
  const staticPost = staticPosts.find(p => p.slug === slug);

  // Pass to client - it will handle user posts from localStorage
  return <BlogPostClient post={staticPost} slug={slug} />;
}
