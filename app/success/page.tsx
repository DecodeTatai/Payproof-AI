"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-[#060816] px-6 py-10 text-white">
      <div className="mx-auto mt-20 max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1020]/90 p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-2xl">
            ✓
          </div>
          <h1 className="mt-6 text-4xl font-semibold">Payment successful</h1>
          <p className="mt-4 text-lg text-white/60">
            Your premium access is ready. Continue to signup with the same email.
          </p>

          {email && <p className="mt-3 text-sm text-cyan-300">{email}</p>}

          <div className="mt-8">
            <Link
              href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="inline-flex rounded-2xl bg-white px-6 py-4 font-semibold text-black"
            >
              Continue to Signup
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#060816] text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
