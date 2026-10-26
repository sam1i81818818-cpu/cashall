"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LaptopBrandSelectionRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sell-old-laptop");
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center text-neutral-800 text-sm font-semibold">
      Redirecting to Sell Old Laptop...
    </div>
  );
}
