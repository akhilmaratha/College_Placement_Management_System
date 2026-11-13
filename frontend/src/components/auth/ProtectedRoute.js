"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getDashboardPathForRole } from "@/services/authService";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();
  const [state, setState] = useState("checking");

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => {
      if (!active) return;
      if (!user) {
        const next = encodeURIComponent(window.location.pathname);
        router.replace(`/login?next=${next}`);
      } else if (user.role !== role) {
        const destination = getDashboardPathForRole(user.role);
        router.replace(destination === "/login" ? "/login" : destination);
      } else {
        setState("ready");
      }
    }).catch(() => {
      if (active) setState("unavailable");
    });
    return () => { active = false; };
  }, [role, router]);

  if (state === "ready") return children;
  if (state === "unavailable") return <main className="mx-auto max-w-xl p-8 text-center" role="alert">Unable to verify your session. Check your connection and reload.</main>;
  return <main className="mx-auto max-w-xl p-8 text-center" role="status">Checking your session…</main>;
}
