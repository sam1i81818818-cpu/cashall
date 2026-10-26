"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  // Fast-path auth state: In dev / localhost or SSR, allow rendering without showing a blocking screen.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const isDevOrLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        process.env.NODE_ENV === "development";

      if (isDevOrLocal) {
        if (!localStorage.getItem("cashall_admin_session")) {
          const devSession = {
            name: "Sangeet Shaw",
            email: "sangeetshaw39@gmail.com",
            role: "ADMIN",
            token: "tok_admin_master_session",
          };
          localStorage.setItem("cashall_admin_session", JSON.stringify(devSession));
          localStorage.setItem("cashall_admin_token", "tok_admin_master_session");
          document.cookie = "cashall_admin_token=tok_admin_master_session; path=/; max-age=2592000; SameSite=Lax";
        }
        return true;
      }

      const session = localStorage.getItem("cashall_admin_session");
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed && (parsed.role === "ADMIN" || parsed.email)) return true;
      }

      if (document.cookie.includes("cashall_admin_token")) return true;
    } catch {
      // fail safe
    }
    return false;
  });

  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    if (typeof window !== "undefined") {
      const isDevOrLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        process.env.NODE_ENV === "development";

      // On localhost/dev: Ensure master session is active and permit access immediately
      if (isDevOrLocal) {
        if (!localStorage.getItem("cashall_admin_session")) {
          const devSession = {
            name: "Sangeet Shaw",
            email: "sangeetshaw39@gmail.com",
            role: "ADMIN",
            token: "tok_admin_master_session",
          };
          localStorage.setItem("cashall_admin_session", JSON.stringify(devSession));
          localStorage.setItem("cashall_admin_token", "tok_admin_master_session");
          document.cookie = "cashall_admin_token=tok_admin_master_session; path=/; max-age=2592000; SameSite=Lax";
        }
        setIsAuthenticated(true);
        setCheckingAuth(false);
        return;
      }

      // Production check
      const session = localStorage.getItem("cashall_admin_session");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed && (parsed.role === "ADMIN" || parsed.email)) {
            setIsAuthenticated(true);
            setCheckingAuth(false);
            return;
          }
        } catch (e) {
          console.error("Invalid admin session token", e);
        }
      }

      // Check cookie token fallback
      if (document.cookie.includes("cashall_admin_token")) {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        return;
      }

      // Not authenticated on production -> Redirect to login
      setIsAuthenticated(false);
      setCheckingAuth(false);
      router.replace("/admin/login");
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">Access Restricted</h1>
        <p className="text-xs text-slate-600 max-w-sm">
          You must log in with authorized admin credentials to access the CashALL Operations Portal.
        </p>
        <button
          onClick={() => router.replace("/admin/login")}
          className="mt-2 bg-amber-400 text-amber-950 font-black text-xs px-6 py-2.5 rounded-xl border border-amber-500 hover:bg-amber-500 shadow-sm transition-all"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
