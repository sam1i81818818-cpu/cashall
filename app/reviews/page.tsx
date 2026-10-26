"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReviewStatsBar } from "@/components/reviews/ReviewStatsBar";
import { CustomerReviewCard } from "@/components/reviews/CustomerReviewCard";
import { CUSTOMER_REVIEWS, CustomerReview, REVIEW_STATS } from "@/lib/data/reviewsData";
import {
  Sparkles,
  Star,
  MessageSquare,
  PenSquare,
  Search,
  Filter,
  CheckCircle2,
  X,
  Loader2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type FilterCategory = "ALL" | "MOBILE_APPLE" | "MOBILE_ANDROID" | "LAPTOP" | "TABLET" | "FIVE_STAR";

function ReviewsPageContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  const [reviews, setReviews] = useState<CustomerReview[]>(CUSTOMER_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(100);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialAction === "write");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    phone: "",
    rating: 5,
    deviceSold: "",
    location: "Kolkata, West Bengal",
    reviewTitle: "",
    reviewText: "",
  });

  // Fetch fresh reviews from DB if available
  useEffect(() => {
    fetch("/api/v1/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.warn("Error loading reviews:", err));
  }, []);

  // Filter tabs
  const filterTabs: { id: FilterCategory; label: string }[] = [
    { id: "ALL", label: `All Reviews (${reviews.length})` },
    { id: "MOBILE_APPLE", label: "Apple iPhone" },
    { id: "MOBILE_ANDROID", label: "Android Phones" },
    { id: "LAPTOP", label: "Laptops & MacBooks" },
    { id: "TABLET", label: "Tablets" },
    { id: "FIVE_STAR", label: "5-Star Ratings" },
  ];

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      // 1. Category Filter
      if (activeFilter === "MOBILE_APPLE") {
        if (item.deviceCategory !== "MOBILE" || !item.deviceSold.toLowerCase().includes("iphone")) return false;
      } else if (activeFilter === "MOBILE_ANDROID") {
        if (item.deviceCategory !== "MOBILE" || item.deviceSold.toLowerCase().includes("iphone")) return false;
      } else if (activeFilter === "LAPTOP") {
        if (item.deviceCategory !== "LAPTOP") return false;
      } else if (activeFilter === "TABLET") {
        if (item.deviceCategory !== "TABLET") return false;
      } else if (activeFilter === "FIVE_STAR") {
        if (item.rating !== 5) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textToSearch = [
          item.customerName,
          item.deviceSold,
          item.reviewTitle,
          item.reviewText,
          item.location,
        ].join(" ").toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      return true;
    });
  }, [reviews, activeFilter, searchQuery]);

  const displayedReviews = filteredReviews.slice(0, visibleCount);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });

      const json = await res.json();
      if (json.success && json.review) {
        setSubmitSuccess(true);
        // Add new review at top
        setReviews((prev) => [json.review, ...prev]);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          setReviewForm({
            customerName: "",
            phone: "",
            rating: 5,
            deviceSold: "",
            location: "Kolkata, West Bengal",
            reviewTitle: "",
            reviewText: "",
          });
        }, 2000);
      } else {
        setFormError(json.error || "Failed to submit review. Please try again.");
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* TOP HERO SECTION */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-brand-black tracking-tight">
              Customer Reviews &amp; Ratings
            </h1>

            <p className="text-sm sm:text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
              Read transparent feedback from device sellers who booked doorstep pickups and received instant UPI payouts across West Bengal &amp; India.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-black hover:bg-brand-dark text-white font-black text-xs sm:text-sm shadow-md transition hover:scale-[1.02] active:scale-95"
              >
                <PenSquare className="w-4 h-4 text-brand-yellow" />
                <span>Write Your Review</span>
              </button>
            </div>
          </div>

          {/* 1. AGGREGATE STATS & TRUST BADGES */}
          <ReviewStatsBar />

          {/* 2. CONTROLS BAR: SEARCH & FILTERS */}
          <div className="bg-white border border-brand-border rounded-3xl p-4 sm:p-6 shadow-subtleCard space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* SEARCH INPUT */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(12);
                  }}
                  placeholder="Search reviews by name, phone model, city..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* WRITE REVIEW BUTTON */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-yellow hover:bg-amber-400 text-brand-black text-xs font-black transition shadow-xs"
              >
                <PenSquare className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            {/* FILTER TABS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-gray-100 pt-3">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveFilter(tab.id);
                      setVisibleCount(12);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-brand-black text-brand-yellow shadow-md"
                        : "bg-neutral-100 text-brand-muted hover:text-brand-black border border-transparent hover:border-brand-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. REVIEWS GRID */}
          {displayedReviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-brand-border space-y-3">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-brand-black">No reviews found</h3>
              <p className="text-xs text-brand-muted">
                No customer reviews match your active filter or search query.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("ALL");
                  setSearchQuery("");
                }}
                className="mt-2 px-4 py-2 bg-brand-black text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedReviews.map((review) => (
                <CustomerReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* 4. LOAD MORE */}
          {visibleCount < filteredReviews.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-8 py-3 rounded-2xl bg-white hover:bg-neutral-50 border border-brand-border font-black text-xs sm:text-sm text-brand-black shadow-subtleCard hover:shadow-premium transition-all"
              >
                Show More Reviews ({filteredReviews.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 5. ADD REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-border shadow-2xl relative space-y-5 my-8">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <PenSquare className="w-5 h-5 text-brand-yellow fill-brand-black" />
                <h3 className="text-lg font-black text-brand-black">Write a Customer Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-brand-black">Thank You!</h4>
                <p className="text-xs text-brand-muted">
                  Your review has been successfully submitted and added to the testimonials list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
                    {formError}
                  </div>
                )}

                {/* STAR RATING PICKER */}
                <div>
                  <label className="block font-bold text-brand-black mb-1.5">
                    Your Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 hover:scale-110 transition active:scale-95"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewForm.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-black text-amber-600 text-sm">
                      {reviewForm.rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                {/* NAME & PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-brand-black mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={reviewForm.customerName}
                      onChange={(e) => setReviewForm({ ...reviewForm, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-black mb-1">
                      Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9830012345"
                      value={reviewForm.phone}
                      onChange={(e) => setReviewForm({ ...reviewForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>
                </div>

                {/* DEVICE SOLD & LOCATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-brand-black mb-1">
                      Device Sold <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apple iPhone 13 (128 GB)"
                      value={reviewForm.deviceSold}
                      onChange={(e) => setReviewForm({ ...reviewForm, deviceSold: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-black mb-1">
                      City / Area <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Howrah / Kolkata"
                      value={reviewForm.location}
                      onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                    />
                  </div>
                </div>

                {/* HEADLINE */}
                <div>
                  <label className="block font-bold text-brand-black mb-1">
                    Review Headline <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Quick doorstep evaluation & instant payment!"
                    value={reviewForm.reviewTitle}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                  />
                </div>

                {/* COMMENT */}
                <div>
                  <label className="block font-bold text-brand-black mb-1">
                    Your Detailed Review <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share how your doorstep pickup was handled, agent behavior, evaluation speed, and payout experience..."
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border focus:outline-none focus:border-brand-yellow font-medium"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-1/3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 flex items-center justify-center gap-2 py-2.5 bg-brand-yellow hover:bg-amber-400 text-brand-black font-black rounded-xl transition shadow-xs disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenSquare className="w-4 h-4" />}
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CRAWLER ACCESSIBLE VERIFIED REVIEWS ARCHIVE */}
      <section className="max-w-7xl mx-auto px-4 py-8 border-t border-brand-border/40 text-xs text-gray-500">
        <h2 className="text-sm font-bold text-brand-black mb-3">
          CashALL Customer Feedback & Device Resale Highlights (Audited Ground Truth)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CUSTOMER_REVIEWS.slice(0, 9).map((rev) => (
            <div key={rev.id} className="p-3 bg-white rounded-xl border border-gray-200">
              <div className="font-bold text-brand-black">{rev.customerName} — {rev.deviceSold}</div>
              <div className="text-[11px] text-gray-600 my-1">&quot;{rev.reviewText}&quot;</div>
              <div className="text-[10px] text-gray-400 font-semibold">{rev.location} • ₹{rev.payoutAmount.toLocaleString("en-IN")} via {rev.payoutMethod} • {rev.rating}★ Verified</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-brand-black" /></div>}>
      <ReviewsPageContent />
    </Suspense>
  );
}
