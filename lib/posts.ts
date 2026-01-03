export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  author?: string;
  authorEmail?: string;
  isUserPost?: boolean;
  createdAt?: string;
}

const USER_POSTS_KEY = "blog-user-posts";

// Static posts (default content)
export const staticPosts: Post[] = [
  {
    slug: "tasarimda-minimalizm",
    title: "Tasarımda Minimalizm: Az Çoktur",
    excerpt:
      "Minimalist tasarım felsefesi, gereksiz öğeleri ortadan kaldırarak özün ön plana çıkmasını sağlar. Bu yazıda minimalizmin temel prensiplerini keşfediyoruz.",
    content: `
# Tasarımda Minimalizm: Az Çoktur

Minimalizm, sadece bir tasarım trendi değil, bir düşünce biçimidir. Her öğenin bir amacı olmalı, yoksa orada bulunmamalıdır.

## Temel Prensipler

### 1. Beyaz Alan Kullanımı
Beyaz alan (negative space), tasarımın nefes almasını sağlar. Öğeler arasındaki boşluk, görsel hiyerarşiyi güçlendirir.

### 2. Tipografi Odaklı Tasarım
Güçlü tipografi, görsel öğelere olan ihtiyacı azaltır. Doğru font seçimi ve boyutlandırma, mesajınızı net bir şekilde iletir.

### 3. Renk Paleti Sınırlaması
İki veya üç renk yeterlidir. Sınırlı palet, tutarlılık ve sofistike bir görünüm sağlar.

## Sonuç

Minimalizm, karmaşıklığı azaltarak kullanıcı deneyimini iyileştirir. Unutmayın: Her piksel bir amaç taşımalı.
    `,
    date: "3 Ocak 2026",
    readTime: "5 dk",
    tags: ["Tasarım", "UX", "Minimalizm"],
    featured: true,
  },
  {
    slug: "react-server-components",
    title: "React Server Components Derinlemesine",
    excerpt:
      "RSC, React ekosisteminde devrim niteliğinde bir yenilik. Server ve client arasındaki sınırları yeniden tanımlıyor.",
    content: `
# React Server Components Derinlemesine

React Server Components (RSC), modern web geliştirmede paradigma değişikliği yaratıyor.

## Neden RSC?

- **Daha küçük bundle boyutu**: Server componentleri client'a gönderilmez
- **Doğrudan veritabanı erişimi**: API katmanına gerek kalmadan
- **Streaming**: Progressive rendering ile daha hızlı FCP

## Kullanım Örneği

\`\`\`tsx
// Bu bir Server Component
async function BlogPost({ slug }) {
  const post = await db.posts.findUnique({ where: { slug } });
  return <article>{post.content}</article>;
}
\`\`\`

## Sonuç

RSC, performans ve geliştirici deneyimini bir üst seviyeye taşıyor.
    `,
    date: "2 Ocak 2026",
    readTime: "8 dk",
    tags: ["React", "Next.js", "Performance"],
  },
  {
    slug: "typescript-tips",
    title: "TypeScript İpuçları ve Püf Noktaları",
    excerpt:
      "Günlük geliştirmede işinize yarayacak TypeScript teknikleri ve best practice'ler.",
    content: `
# TypeScript İpuçları ve Püf Noktaları

TypeScript, JavaScript'e tip güvenliği katarak daha sağlam kod yazmamızı sağlar.

## Utility Types

### Partial<T>
Tüm property'leri opsiyonel yapar.

### Pick<T, K>
Belirli property'leri seçer.

### Omit<T, K>
Belirli property'leri hariç tutar.

## Template Literal Types

\`\`\`typescript
type EventName = \`on\${Capitalize<string>}\`;
// "onClick", "onHover", "onSubmit" vb.
\`\`\`

## Sonuç

TypeScript'i etkili kullanmak, kod kalitesini dramatik şekilde artırır.
    `,
    date: "1 Ocak 2026",
    readTime: "6 dk",
    tags: ["TypeScript", "JavaScript", "Tips"],
  },
  {
    slug: "tailwind-best-practices",
    title: "Tailwind CSS Best Practices",
    excerpt:
      "Tailwind CSS ile temiz, sürdürülebilir ve performanslı stil yazmanın yolları.",
    content: `
# Tailwind CSS Best Practices

Tailwind, utility-first yaklaşımıyla CSS yazma şeklimizi değiştirdi.

## Organizasyon

### Component Extraction
Tekrar eden pattern'leri component'lere çıkarın.

### @apply Kullanımı
Sadece gerçekten gerektiğinde kullanın.

## Performance

- PurgeCSS ile kullanılmayan stilleri temizleyin
- JIT mode ile development hızını artırın

## Sonuç

Tailwind, doğru kullanıldığında hem hızlı geliştirme hem de küçük bundle boyutu sağlar.
    `,
    date: "31 Aralık 2025",
    readTime: "4 dk",
    tags: ["CSS", "Tailwind", "Frontend"],
  },
];

// Get user posts from localStorage
export function getUserPosts(): Post[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USER_POSTS_KEY);
  if (!stored) return [];
  
  try {
    const posts = JSON.parse(stored);
    return posts.map((p: Post) => ({ ...p, isUserPost: true }));
  } catch {
    return [];
  }
}

// Get all posts (user posts first, then static posts)
export function getAllPosts(): Post[] {
  const userPosts = getUserPosts();
  return [...userPosts, ...staticPosts];
}

// Get post by slug (checks both user and static posts)
export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug);
}

// Save user posts to localStorage
function saveUserPosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_POSTS_KEY, JSON.stringify(posts));
}

// Update a user post
export function updatePost(slug: string, updates: Partial<Post>): Post | null {
  const userPosts = getUserPosts();
  const index = userPosts.findIndex((p) => p.slug === slug);
  
  if (index === -1) return null;
  
  const updatedPost = { ...userPosts[index], ...updates };
  
  // If title changed, update slug
  if (updates.title && updates.title !== userPosts[index].title) {
    updatedPost.slug = updates.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  
  userPosts[index] = updatedPost;
  saveUserPosts(userPosts.map(({ isUserPost, ...p }) => p));
  
  return updatedPost;
}

// Delete a user post
export function deletePost(slug: string): boolean {
  const userPosts = getUserPosts();
  const filtered = userPosts.filter((p) => p.slug !== slug);
  
  if (filtered.length === userPosts.length) return false;
  
  saveUserPosts(filtered.map(({ isUserPost, ...p }) => p));
  return true;
}

// Check if user can edit/delete a post
export function canEditPost(post: Post, userEmail: string | undefined): boolean {
  if (!post.isUserPost || !userEmail) return false;
  // Allow edit if authorEmail matches OR if no authorEmail (backward compatibility)
  return post.authorEmail === userEmail || !post.authorEmail;
}

// Legacy export for compatibility
export const posts = staticPosts;
