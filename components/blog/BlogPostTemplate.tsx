import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogPost } from "@/lib/data/blogData";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Share2
} from "lucide-react";

interface BlogPostTemplateProps {
  post: BlogPost;
}

export function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.cashall.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://www.cashall.in/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://www.cashall.in/${post.slug}`
          }
        ]
      },
      {
        "@type": "NewsArticle",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "author": {
          "@type": "Organization",
          "name": post.author.name
        },
        "publisher": {
          "@type": "Organization",
          "name": "CashALL",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.cashall.in/photos/CashALL_logo.webp"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.cashall.in/${post.slug}`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": post.content.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow py-8 sm:py-12">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* BREADCRUMB NAVIGATION */}
          <nav className="flex items-center gap-1.5 text-xs text-brand-muted flex-wrap">
            <Link href="/" className="hover:text-brand-black transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-muted shrink-0" />
            <Link href="/blog" className="hover:text-brand-black transition">Blog & Insights</Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-muted shrink-0" />
            <span className="text-brand-black font-semibold truncate max-w-xs">{post.title}</span>
          </nav>

          {/* ARTICLE HEADER */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-brand-muted font-medium">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span className="text-brand-muted">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-brand-muted font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Updated {new Date(post.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand-black tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-brand-muted font-medium leading-relaxed">
              {post.subtitle}
            </p>

            <div className="flex items-center justify-between border-y border-brand-border py-4 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-black text-brand-yellow font-black flex items-center justify-center text-xs shadow-xs">
                  {post.author.avatar}
                </div>
                <div>
                  <div className="text-xs font-black text-brand-black">{post.author.name}</div>
                  <div className="text-[11px] text-brand-muted">{post.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-xs shadow-xs transition"
                >
                  <span>Check Phone Value</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </header>

          {/* DIRECT ANSWER BOX */}
          <section className="bg-amber-50/80 border-2 border-brand-yellow/80 rounded-3xl p-6 sm:p-7 shadow-subtleCard space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-brand-black" />
              <span>Direct Answer</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-brand-black leading-snug">
              {post.aeoQuickAnswer.question}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium">
              {post.aeoQuickAnswer.answer}
            </p>
            <div className="pt-2 border-t border-amber-200/80 flex items-start gap-2 text-xs text-amber-950 font-bold">
              <span className="w-2 h-2 rounded-full bg-brand-yellow shrink-0 mt-1.5" />
              <span>{post.aeoQuickAnswer.keyTakeaway}</span>
            </div>
          </section>

          {/* GEO (LOCAL SEARCH & RESALE TRENDS) BOX */}
          <section className="bg-white border border-brand-border rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                {post.geoInsights.region} • {post.geoInsights.trendHeadline}
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                {post.geoInsights.insight}
              </p>
            </div>
          </section>

          {/* MAIN ARTICLE BODY */}
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-10 shadow-subtleCard space-y-8 text-neutral-800 leading-relaxed text-sm sm:text-base">
            <p className="text-base sm:text-lg font-medium text-brand-black leading-relaxed">
              {post.content.intro}
            </p>

            {post.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-4 pt-4 border-t border-brand-border/60">
                <h2 className="text-xl sm:text-2xl font-black text-brand-black tracking-tight">
                  {section.heading}
                </h2>

                {section.body.map((para, pIdx) => (
                  <p key={pIdx} className="text-neutral-700 leading-relaxed text-sm sm:text-base">
                    {para}
                  </p>
                ))}

                {/* OPTIONAL CALLOUT BOX */}
                {section.callout && (
                  <div className={`rounded-2xl p-5 border text-xs sm:text-sm font-medium flex items-start gap-3 ${
                    section.callout.type === "warning"
                      ? "bg-red-50 border-red-200 text-red-900"
                      : section.callout.type === "tip"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                      : "bg-brand-yellow/15 border-brand-yellow/60 text-brand-black"
                  }`}>
                    {section.callout.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-brand-black shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-black block mb-0.5">{section.callout.title}</span>
                      <span>{section.callout.text}</span>
                    </div>
                  </div>
                )}

                {/* OPTIONAL TABLE */}
                {section.table && (
                  <div className="overflow-x-auto rounded-2xl border border-brand-border mt-4">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-brand-black text-white font-bold">
                        <tr>
                          {section.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3.5 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border">
                        {section.table.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-3.5 ${cIdx === 0 ? "font-bold text-brand-black" : "text-neutral-700"}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* INTERACTIVE FAQS */}
          <section className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-subtleCard space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-black" />
              <h3 className="text-xl font-black text-brand-black">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3">
              {post.content.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-brand-bg border border-brand-border rounded-2xl p-5 space-y-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-brand-black">
                    {faq.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* SELL CALL TO ACTION FOOTER BANNER */}
          <section className="bg-brand-black text-white rounded-3xl p-8 sm:p-10 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center sm:text-left z-10">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Ready to Sell Your Device Today?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md">
                Get up to 5% higher price than other online platforms, enjoy free doorstep pickup in Kolkata, Howrah, Hooghly &amp; Gorakhpur, and receive instant UPI cash on the spot!
              </p>
            </div>

            <div className="z-10 shrink-0">
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-yellow hover:bg-amber-400 text-brand-black font-black text-sm shadow-md transition hover:scale-105 active:scale-95"
              >
                <span>Check Your Phone Price</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* TAGS CLOUD */}
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <span className="text-xs text-brand-muted font-bold">Related Topics:</span>
            {post.tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-xs bg-white border border-brand-border px-3 py-1 rounded-full text-brand-black font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
