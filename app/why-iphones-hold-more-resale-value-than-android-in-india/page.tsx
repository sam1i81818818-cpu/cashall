import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

const SLUG = "why-iphones-hold-more-resale-value-than-android-in-india";

export const metadata: Metadata = {
  title: "Why iPhones Hold More Resale Value Than Android In India | CashALL Analysis",
  description:
    "Discover why used iPhones hold up to 65% of their value in India while Android flagships depreciate faster. Key insights on software support, parts availability, and resale demand.",
  keywords: ["why iphones hold more resale value", "iphone vs android resale value india", "sell old iphone best price", "cashall"],
  alternates: {
    canonical: `https://www.cashall.in/${SLUG}`,
  },
  openGraph: {
    title: "Why iPhones Hold More Resale Value Than Android In India | CashALL",
    description: "Discover why used iPhones hold up to 65% of their value in India while Android flagships depreciate faster.",
    url: `https://www.cashall.in/${SLUG}`,
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function Page() {
  const post = BLOG_POSTS.find((p) => p.slug === SLUG);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
