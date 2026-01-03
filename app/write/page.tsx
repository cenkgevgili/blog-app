"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { getPostBySlug, updatePost, canEditPost, type Post } from "@/lib/posts";
import { ArrowLeft, Send, Save, X, Plus, Eye, Edit3 } from "lucide-react";
import Link from "next/link";

function WritePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get("edit");
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load post for editing
    if (editSlug) {
      const post = getPostBySlug(editSlug);
      if (post && canEditPost(post, user.email)) {
        setEditingPost(post);
        setTitle(post.title);
        setExcerpt(post.excerpt || "");
        setContent(post.content);
        setTags(post.tags || []);
      } else {
        router.push("/");
      }
    }
  }, [router, editSlug]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;
    
    setIsPublishing(true);
    const user = getCurrentUser();
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    if (editingPost) {
      // Update existing post
      const updated = updatePost(editingPost.slug, {
        title,
        excerpt: excerpt || content.slice(0, 150) + "...",
        content,
        tags,
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} dk`,
      });
      
      setTimeout(() => {
        setIsPublishing(false);
        router.push(updated ? `/blog/${updated.slug}` : "/");
      }, 500);
    } else {
      // Create new post
      const posts = JSON.parse(localStorage.getItem("blog-user-posts") || "[]");
      const newPost = {
        id: crypto.randomUUID(),
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        title,
        excerpt: excerpt || content.slice(0, 150) + "...",
        content,
        tags,
        date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} dk`,
        author: user?.name || "Anonim",
        authorEmail: user?.email,
        createdAt: new Date().toISOString(),
      };
      posts.unshift(newPost);
      localStorage.setItem("blog-user-posts", JSON.stringify(posts));

      setTimeout(() => {
        setIsPublishing(false);
        router.push("/");
      }, 1000);
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href={editingPost ? `/blog/${editingPost.slug}` : "/"} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {editingPost ? "İptal" : "Geri"}
            </Link>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
                className="gap-2"
              >
                {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreview ? "Düzenle" : "Önizle"}
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handlePublish}
                  disabled={!title.trim() || !content.trim() || isPublishing}
                  className="gap-2"
                >
                  {editingPost ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {isPublishing ? (editingPost ? "Kaydediliyor..." : "Yayınlanıyor...") : (editingPost ? "Kaydet" : "Yayınla")}
                </Button>
              </motion.div>
            </div>
          </div>

          {isPreview ? (
            /* Preview Mode */
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2 mb-4">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <h1 className="text-4xl font-bold mb-4">{title || "Başlık"}</h1>
                <p className="text-muted-foreground mb-6">{excerpt || "Özet"}</p>
                <div className="text-sm text-muted-foreground mb-8">
                  {wordCount} kelime · {readTime} dk okuma
                </div>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  {content.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              {/* Title */}
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Başlık"
                  className="text-3xl font-bold h-auto py-4 border-0 border-b rounded-none focus-visible:ring-0 px-0"
                />
              </div>

              {/* Excerpt */}
              <div>
                <Input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kısa özet (opsiyonel)"
                  className="text-lg text-muted-foreground h-auto py-2 border-0 border-b rounded-none focus-visible:ring-0 px-0"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Etiketler</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Etiket ekle"
                    className="flex-1"
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addTag}
                    disabled={!tagInput.trim() || tags.length >= 5}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{tags.length}/5 etiket</p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>İçerik</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Yazınızı buraya yazın..."
                  className="min-h-[400px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {wordCount} kelime · Tahmini okuma süresi: {readTime} dk
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Yükleniyor...</div></div>}>
      <WritePageContent />
    </Suspense>
  );
}
