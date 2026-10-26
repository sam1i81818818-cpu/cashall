import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Article Not Found | CashALL",
    };
  }

  return {
    title: `${post.title} | CashALL Smart Resale`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `https://www.cashall.in/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://www.cashall.in/blog/${post.slug}`,
      images: ["/photos/CashALL_logo.png"],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return <BlogPostTemplate post={post} />;
}
