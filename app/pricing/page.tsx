"use client";

import { useState } from "react";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID!;

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout create failed");
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(34,211,238,0.12),transparent_25%),radial-gradient(circle_at_right,rgba(217,70,239,0.10),transparent_25%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Premium SaaS access
            </div>

            <h1 className="mt-8 text-6xl font-semibold leading-tight tracking-[-0.05em]">
              Get full access to
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                proof packs, approvals, and invoices.
              </span>
            </h1>

            <p className="mt-8 text-2xl leading-10 text-white/60">
              Payment first, then signup. Premium access only.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1020]/95 p-8">
              <h2 className="text-4xl font-semibold tracking-tight">PayProof Pro</h2>
              <p className="mt-3 text-white/55">Premium plan for freelancers and agencies</p>

              <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/45">Price</p>
                <p className="mt-3 text-5xl font-semibold">$15<span className="text-2xl text-white/55">/month</span></p>
              </div>

              <div className="mt-8">
                <label className="mb-3 block text-sm font-medium text-white/75">Your email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40 focus:bg-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !email}
                className="mt-6 w-full rounded-2xl bg-white px-4 py-4 font-semibold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Redirecting..." : "Subscribe Now"}
              </button>

              <p className="mt-5 text-center text-sm text-white/40">
                You must complete payment before signup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
