"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { VideoReview } from "@/lib/data/reviewsData";
import {
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
} from "lucide-react";

interface VideoPlayerModalProps {
  review: VideoReview | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ review, isOpen, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setVideoError(false);
      setProgress(0);
      setIsPlaying(true);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !review) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const getDeviceIcon = () => {
    if (review.deviceCategory === "LAPTOP") return <Laptop className="w-4 h-4 text-brand-yellow" />;
    if (review.deviceCategory === "TABLET") return <Tablet className="w-4 h-4 text-brand-yellow" />;
    return <Smartphone className="w-4 h-4 text-brand-yellow" />;
  };

  // Route URL for selling this device
  const sellUrl =
    review.deviceCategory === "MOBILE"
      ? `/sell-old-mobile-phone/${review.brandSlug}/${review.modelSlug}`
      : review.deviceCategory === "LAPTOP"
      ? `/sell-old-laptop`
      : `/sell-old-tablet`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* BACKGROUND CLICK TO CLOSE */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-700 shadow-2xl z-10 flex flex-col max-h-[92vh]">
        {/* TOP BAR / CONTROLS */}
        <div className="absolute top-0 inset-x-0 p-4 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-br ${review.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-md border border-white/20`}
            >
              {review.customerName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-sm font-bold">{review.customerName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <span className="text-[11px] text-gray-300">{review.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 text-white flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-brand-yellow transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* VIDEO DISPLAY AREA */}
        <div
          className="relative aspect-[9/16] w-full bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
          onClick={togglePlay}
        >
          {review.videoUrl && !videoError ? (
            <video
              ref={videoRef}
              src={review.videoUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            /* SLEEK FALLBACK DISPLAY BEFORE VIDEO FILE IS UPLOADED */
            <div className="relative w-full h-full flex flex-col justify-center items-center p-6 text-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900">
              <div className="w-20 h-20 rounded-full bg-brand-yellow/10 border-2 border-brand-yellow/40 flex items-center justify-center mb-6 animate-pulse">
                <Play className="w-8 h-8 text-brand-yellow fill-brand-yellow ml-1" />
              </div>

              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Customer Video</span>
              </p>

              <p className="text-white font-medium text-sm sm:text-base leading-relaxed max-w-xs italic mb-4">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div className="text-xs text-gray-400">
                Tap or provide video file to preview live streaming
              </div>
            </div>
          )}

          {/* PLAY / PAUSE OVERLAY ON TAP */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM DETAILS & SELL CTA */}
        <div className="p-4 sm:p-5 bg-gradient-to-t from-black via-neutral-950 to-neutral-900 border-t border-neutral-800 space-y-3 z-20">
          {/* STAR RATING & SPEED */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="text-white text-xs font-bold ml-1.5">5.0 / 5.0</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              ⚡ {review.payoutSpeed}
            </span>
          </div>

          {/* DEVICE & PAYOUT HIGHLIGHT */}
          <div className="bg-neutral-800/70 border border-neutral-700/60 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-700/60 border border-neutral-600 flex items-center justify-center">
                {getDeviceIcon()}
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">
                  {review.deviceSold}
                </div>
                <div className="text-[11px] text-gray-400">{review.payoutMethod}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-semibold uppercase">Received</div>
              <div className="text-base font-black text-brand-yellow font-price">
                ₹{review.payoutAmount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* CTA BUTTON */}
          <Link
            href={sellUrl}
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-brand-yellow hover:bg-yellow-400 active:scale-[0.98] text-brand-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Check Value For Your Device</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
