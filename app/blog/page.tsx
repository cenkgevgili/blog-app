"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts, type Post } from "@/lib/posts";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all posts including user posts from localStorage
    setPosts(getAllPosts());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tüm Yazılar
          </h1>
          <p className="text-lg text-muted-foreground">
            Frontend, tasarım ve teknoloji üzerine düşünceler
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <div
              key={post.slug}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
