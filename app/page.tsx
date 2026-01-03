"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog-card";
import { getAllPosts, type Post } from "@/lib/posts";
import { ArrowDown } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(getAllPosts());
    setLoading(false);
  }, []);

  const featuredPost = posts.find((p) => p.featured);
  const otherPosts = posts.filter((p) => !p.featured);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />

        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent/10 blur-3xl"
          animate={{
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="animate-fade-in"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Minimalist Blog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in animation-delay-100"
          >
            Düşünceler,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              Kod
            </span>{" "}
            ve Tasarım
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-200"
          >
            Frontend geliştirme, UI/UX tasarım ve modern web teknolojileri
            üzerine derinlemesine yazılar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex justify-center animate-fade-in animation-delay-500"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="animate-bounce"
            >
              <ArrowDown className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="mb-8 animate-fade-in">
            <span className="text-sm font-medium text-primary">Öne Çıkan</span>
          </div>
          <div className="animate-fade-in animation-delay-100">
            <BlogCard {...featuredPost} />
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8 animate-fade-in">
          <span className="text-sm font-medium text-muted-foreground">
            Tüm Yazılar
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {otherPosts.map((post, index) => (
            <div
              key={post.slug}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Minimalist tasarım ile oluşturuldu. © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
