import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

const SLUG = "512gb-phones-the-sweet-spot-for-resale-value";

export const metadata: Metadata = {
  title: "512GB Phones: The Sweet Spot For Resale Value In 2026 | CashALL Buyback",
  description:
    "Understand why 512GB is the best storage capacity for phone resale value in 2026. Avoid 128GB depreciation and 1TB luxury loss. Sell old phones online with CashALL.",
  keywords: ["512gb phones resale value", "best storage for phone resale", "sell old phone kolkata", "cashall buyback"],
  alternates: {
    canonical: `https://www.cashall.in/${SLUG}`,
  },
  openGraph: {
    title: "512GB Phones: The Sweet Spot For Resale Value In 2026 | CashALL",
    description: "Understand why 512GB is the best storage capacity for phone resale value in 2026.",
    url: `https://www.cashall.in/${SLUG}`,
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function Page() {
  const post = BLOG_POSTS.find((p) => p.slug === SLUG);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
