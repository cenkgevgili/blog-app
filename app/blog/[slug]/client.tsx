"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReadingProgress } from "@/components/reading-progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, ArrowLeft, Share2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { canEditPost, deletePost, getPostBySlug, type Post } from "@/lib/posts";

interface BlogPostClientProps {
  post?: Post;
  slug: string;
}

export function BlogPostClient({ post: initialPost, slug }: BlogPostClientProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [canEdit, setCanEdit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(!initialPost);

  useEffect(() => {
    // If no initial post (user post), try to find it in localStorage
    if (!initialPost) {
      const foundPost = getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
      }
      setLoading(false);
    }
  }, [initialPost, slug]);

  useEffect(() => {
    if (post) {
      const user = getCurrentUser();
      // Check if user can edit - either by authorEmail or if it's a user post and user is logged in
      const canUserEdit = post.isUserPost && user && (post.authorEmail === user.email || !post.authorEmail);
      setCanEdit(!!canUserEdit);
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Yazı bulunamadı</h1>
        <Link href="/blog">
          <Button variant="outline">Tüm Yazılara Dön</Button>
        </Link>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deletePost(post.slug);
    setTimeout(() => {
      router.push("/blog");
    }, 300);
  };

  return (
    <>
      <ReadingProgress />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazıyı silmek istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Yazınız kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <article className="min-h-screen py-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back button */}
          <div className="mb-12 animate-fade-in flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Geri
              </Button>
            </Link>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Link href={`/write?edit=${post.slug}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="w-4 h-4" />
                    Düzenle
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </Button>
              </div>
            )}
          </div>

          {/* Header */}
          <header className="mb-12 animate-fade-in animation-delay-100">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>

            <div className="flex items-center justify-between border-y border-border/50 py-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime} okuma
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none animate-fade-in animation-delay-200">
            {post.content.split("\n").map((paragraph, index) => {
              if (paragraph.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-3xl font-bold mt-12 mb-6">
                    {paragraph.replace("# ", "")}
                  </h1>
                );
              }
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-semibold mt-10 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-8 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("```")) {
                return null;
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <li key={index} className="text-muted-foreground ml-4">
                    {paragraph.replace("- ", "")}
                  </li>
                );
              }
              if (paragraph.trim() === "") {
                return null;
              }
              return (
                <p
                  key={index}
                  className="text-muted-foreground leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border/50 animate-fade-in animation-delay-300">
            <div className="flex items-center justify-between">
              <Link href="/blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Tüm Yazılar
                </Button>
              </Link>

              <Button variant="ghost" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Paylaş
              </Button>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
