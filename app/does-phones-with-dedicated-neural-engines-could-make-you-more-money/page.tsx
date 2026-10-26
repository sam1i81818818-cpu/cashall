import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

const SLUG = "does-phones-with-dedicated-neural-engines-could-make-you-more-money";

export const metadata: Metadata = {
  title: "Do Phones With Dedicated Neural Engines Make You More Money? | CashALL",
  description:
    "Explore how on-device AI capabilities (Apple Intelligence, Galaxy AI, Gemini Nano) are increasing used smartphone buyback valuations in 2026. Sell your AI phone on CashALL.",
  keywords: ["ai phones resale value", "neural engine resale price", "apple intelligence buyback", "galaxy ai resale value", "cashall"],
  alternates: {
    canonical: `https://www.cashall.in/${SLUG}`,
  },
  openGraph: {
    title: "Do Phones With Dedicated Neural Engines Make You More Money? | CashALL",
    description: "Explore how on-device AI capabilities are increasing used smartphone buyback valuations in 2026.",
    url: `https://www.cashall.in/${SLUG}`,
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function Page() {
  const post = BLOG_POSTS.find((p) => p.slug === SLUG);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
