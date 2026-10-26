"use client";

import React, { useState } from "react";
import { Smartphone, Laptop, Tablet } from "lucide-react";

interface DeviceCardImageProps {
  src?: string | null;
  alt: string;
  category?: "MOBILE" | "LAPTOP" | "TABLET" | string;
  className?: string;
}

export function DeviceCardImage({
  src,
  alt,
  category = "MOBILE",
  className = "object-contain max-h-24 w-auto group-hover:scale-105 transition-transform",
}: DeviceCardImageProps) {
  const [hasError, setHasError] = useState(false);

  const renderFallbackIcon = () => {
    switch (category?.toUpperCase()) {
      case "LAPTOP":
        return <Laptop className="w-10 h-10 text-neutral-400 group-hover:text-amber-500 transition-colors" />;
      case "TABLET":
        return <Tablet className="w-10 h-10 text-neutral-400 group-hover:text-amber-500 transition-colors" />;
      case "MOBILE":
      default:
        return <Smartphone className="w-10 h-10 text-neutral-400 group-hover:text-amber-500 transition-colors" />;
    }
  };

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-stone-50 to-neutral-100/80 border border-neutral-200/40">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-1">
          {renderFallbackIcon()}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
