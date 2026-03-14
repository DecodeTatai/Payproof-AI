"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      await supabase.from("profiles").upsert({
        id: userData.user.id,
        email: userData.user.email,
      });
    }

    setLoading(false);
    router.push("/dashboard");
  };

  const handleForgotPassword = async () => {
    setMsg("");

    if (!email) {
      setMsg("First enter your email address.");
      return;
    }

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    setResetLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Password reset email sent. Please check your inbox.");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.12),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Welcome back to PayProof AI
              </div>

              <h1 className="text-5xl font-semibold leading-tight tracking-[-0.04em]">
                Log in and manage your
                <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  proof packs, approvals, and invoices.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-white/60">
                Track completed work, collect approvals faster, and stay on top
                of unpaid invoices with one clean system.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-sm text-white/45">Fast workflow</p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Proof packs in minutes
                  </h3>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="text-sm text-white/45">Better control</p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Track due and paid invoices
                  </h3>
                </div>
              </div>
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
                      <p className="text-xs text-white/45">
                        Professional payment workflow
                      </p>
                    </div>
                  </Link>

                  <h2 className="text-3xl font-semibold tracking-tight">
                    Login
                  </h2>
                  <p className="mt-2 text-sm text-white/55">
                    Access your workspace and continue where you left off.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div className="mb-2 flex items-center justify-between">
                      <label className="block text-sm font-medium text-white/75">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading}
                        className="text-xs text-cyan-300 transition hover:text-cyan-200 disabled:opacity-60"
                      >
                        {resetLoading ? "Sending..." : "Forgot password?"}
                      </button>
                    </div>

                    <input
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-white/30 transition focus:border-cyan-400/40 focus:bg-white/10"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {msg && (
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                      {msg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-white px-4 py-3.5 font-semibold text-black transition hover:scale-[1.01] hover:shadow-[0_18px_60px_rgba(255,255,255,0.15)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Logging in..." : "Login to Dashboard"}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs uppercase tracking-[0.2em] text-white/35">
                    Account
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <p className="text-center text-sm text-white/55">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}