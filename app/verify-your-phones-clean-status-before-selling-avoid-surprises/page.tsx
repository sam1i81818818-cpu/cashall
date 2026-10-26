import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

const SLUG = "verify-your-phones-clean-status-before-selling-avoid-surprises";

export const metadata: Metadata = {
  title: "Verify Your Phone's Clean Status Before Selling: Avoid Surprises | CashALL",
  description:
    "Learn how to verify your phone's IMEI clean status, unlock FRP/iCloud, check CEIR blacklist, and ensure a smooth doorstep selling experience without unexpected price deductions.",
  keywords: ["verify phone clean status", "check phone imei status", "sell phone without surprises", "avoid price drops", "cashall"],
  alternates: {
    canonical: `https://www.cashall.in/${SLUG}`,
  },
  openGraph: {
    title: "Verify Your Phone's Clean Status Before Selling: Avoid Surprises | CashALL",
    description: "Learn how to verify your phone's clean status before selling.",
    url: `https://www.cashall.in/${SLUG}`,
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function Page() {
  const post = BLOG_POSTS.find((p) => p.slug === SLUG);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
