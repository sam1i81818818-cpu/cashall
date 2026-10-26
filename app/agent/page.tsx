"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AgentRootPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("cashall_agent_session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed?.token || parsed?.agent) {
            router.replace("/agent/dashboard");
            return;
          }
        } catch (e) {}
      }
      router.replace("/agent/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-black">
      <div className="animate-pulse text-xs font-bold text-neutral-400">
        Redirecting to Agent Portal...
      </div>
    </div>
  );
}
