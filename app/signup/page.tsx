"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!email) {
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("checkout_intents")
        .select("status")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        setEligible(false);
        setChecking(false);
        return;
      }

      const allowedStatuses = ["succeeded", "confirmed", "active", "paid"];
      setEligible(!!data && allowedStatuses.includes((data.status || "").toLowerCase()));
      setChecking(false);
    };

    checkEligibility();
  }, [email]);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!eligible) {
      setMsg("Payment complete koro tarpor signup korte parba.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }

    const user = data.user;

    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        subscription_status: "active",
        subscription_plan: "pro_monthly",
        subscription_provider: "polar",
      });
    }

    setLoading(false);
    setMsg("Signup successful. Please check your email to confirm your account.");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.12),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Premium members only
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-[-0.04em]">
                Create your
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  premium workspace account.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
                Access is unlocked only after subscription payment is confirmed.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1020]/90 p-8">
                <div className="mb-8">
                  <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-3 text-white/80 transition hover:text-white"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                      <span className="text-lg font-bold">P</span>
                    </div>
                    <div>
                      <p className="font-semibold">PayProof AI</p>
                      <p className="text-xs text-white/45">Premium access</p>
                    </div>
                  </Link>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm text-white/55">
                    Payment first, then signup.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Full name
                    </label>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30 transition focus:border-cyan-400/40 focus:bg-white/10"
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Email address
                    </label>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30 transition focus:border-cyan-400/40 focus:bg-white/10"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Password
                    </label>
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30 transition focus:border-cyan-400/40 focus:bg-white/10"
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {!eligible && !checking && (
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                      No active payment found. Payment complete kore tarpor signup korte hobe.
                    </div>
                  )}

                  {msg && (
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                      {msg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || checking || !eligible}
                    className="w-full rounded-2xl bg-white px-4 py-3.5 font-semibold text-black transition hover:scale-[1.01] hover:shadow-[0_18px_60px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {checking
                      ? "Checking payment..."
                      : loading
                      ? "Creating account..."
                      : "Create Premium Account"}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Access
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {!eligible && !checking ? (
                  <p className="text-center text-sm text-white/55">
                    Need premium access first?{" "}
                    <Link
                      href="/pricing"
                      className="font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Complete payment
                    </Link>
                  </p>
                ) : (
                  <p className="text-center text-sm text-white/55">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                      Login
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#060816] text-white">
          Loading signup...
        </main>
      }
    >
      <SignupPageContent />
    </Suspense>
  );
}