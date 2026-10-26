import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/data/blogData";
import { BlogPostTemplate } from "@/components/blog/BlogPostTemplate";

const SLUG = "steps-to-ensure-your-digital-sim-doesnt-go-with-sold-phones";

export const metadata: Metadata = {
  title: "Steps To Ensure Your Digital SIM Doesn't Go With Sold Phones | CashALL Security",
  description:
    "Don't lose your phone number or risk OTP theft! Follow these steps to properly delete and transfer your eSIM (Jio, Airtel, Vi) before selling your phone.",
  keywords: ["esim removal before selling", "delete digital sim", "esim security", "sell iphone safely", "cashall data security"],
  alternates: {
    canonical: `https://www.cashall.in/${SLUG}`,
  },
  openGraph: {
    title: "Steps To Ensure Your Digital SIM Doesn't Go With Sold Phones | CashALL",
    description: "Follow these steps to properly delete and transfer your eSIM before selling your phone.",
    url: `https://www.cashall.in/${SLUG}`,
    images: ["/photos/CashALL_logo.png"],
  },
};

export default function Page() {
  const post = BLOG_POSTS.find((p) => p.slug === SLUG);
  if (!post) notFound();
  return <BlogPostTemplate post={post} />;
}
