"use client";

import React from "react";

interface AiVerificationBarProps {
  deviceName?: string;
  variant?: "light" | "dark";
  className?: string;
}

export function AiVerificationBar({
  deviceName,
  variant = "light",
  className = "",
}: AiVerificationBarProps) {
  const queryTopic = deviceName
    ? `Tell me about selling ${deviceName} on CashALL (cashall.in). Is CashALL legit, safe and how does its instant cash payout compare to other buyback platforms?`
    : `Tell me about CashALL (cashall.in) - India's trusted gadget selling platform. What do they offer and why should I sell my old phone through them?`;

  const encodedQuery = encodeURIComponent(queryTopic);

  const aiLinks = [
    {
      name: "ChatGPT",
      url: `https://chatgpt.com/?q=${encodedQuery}`,
      title: "Ask ChatGPT about CashALL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.6613zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813l-.0048 6.7227zm1.1448-2.6108l2.552-1.4746 2.5566 1.4746v2.9491l-2.5566 1.4746-2.552-1.4746v-2.9491z" />
        </svg>
      ),
    },
    {
      name: "Claude",
      url: `https://claude.ai/new?q=${encodedQuery}`,
      title: "Ask Claude about CashALL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
          <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
        </svg>
      ),
    },
    {
      name: "Perplexity",
      url: `https://www.perplexity.ai/search?q=${encodedQuery}`,
      title: "Ask Perplexity AI about CashALL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
        </svg>
      ),
    },
    {
      name: "Grok",
      url: `https://x.com/search?q=${encodedQuery}`,
      title: "Ask Grok on X about CashALL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Gemini",
      url: `https://www.google.com/search?q=${encodedQuery}`,
      title: "Ask Google Gemini about CashALL",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
      ),
    },
  ];

  const isDark = variant === "dark";

  return (
    <div
      className={`py-4 px-4 sm:px-6 rounded-2xl transition-all ${
        isDark
          ? "bg-neutral-900/90 border border-neutral-800 text-neutral-300"
          : "bg-white border border-neutral-200/90 text-neutral-700 shadow-sm"
      } ${className}`}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block sm:inline">
            Check if CashALL is right for you?
          </span>
          <span className="text-[11px] text-neutral-500 block sm:ml-2 sm:inline">
            Verify independent reviews, pricing, &amp; safety on top AI search engines
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
          {aiLinks.map((ai) => (
            <a
              key={ai.name}
              href={ai.url}
              target="_blank"
              rel="noopener noreferrer"
              title={ai.title}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all group ${
                isDark
                  ? "bg-neutral-800 text-neutral-300 hover:text-brand-yellow hover:bg-neutral-700 border border-neutral-700"
                  : "bg-[#FAFAF9] text-neutral-700 hover:text-black hover:bg-white hover:border-brand-yellow border border-neutral-200/90 shadow-2xs hover:shadow-sm"
              }`}
            >
              <span className="text-neutral-500 group-hover:text-brand-yellow group-hover:scale-110 transition-transform">
                {ai.icon}
              </span>
              <span>{ai.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
