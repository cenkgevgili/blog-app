"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  isUserPost?: boolean;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  date,
  readTime,
  tags,
  featured = false,
  isUserPost = false,
}: BlogCardProps) {
  // User posts use query param to avoid static export issues
  const href = isUserPost ? `/blog/user-post?slug=${slug}` : `/blog/${slug}`;

  return (
    <Link href={href}>
      <Card
        className={`group relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 ${
          featured ? "md:col-span-2" : ""
        }`}
      >
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h3
            className={`font-semibold tracking-tight mb-3 group-hover:text-primary transition-colors ${
              featured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {title}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
            {excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300">
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Hover gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </CardContent>
      </Card>
    </Link>
  );
}
