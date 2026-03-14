"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl transition-all duration-150"
          style={{ left: mouse.x, top: mouse.y }}
        />
        <div
          className="absolute h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/15 blur-3xl transition-all duration-300"
          style={{ left: mouse.x - 80, top: mouse.y - 80 }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.10),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />

      <header className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-xl">
              <span className="text-lg font-bold">P</span>
            </div>
            <div>
              <p className="text-base font-semibold tracking-wide">PayProof AI</p>
              <p className="text-xs text-white/50">Proof packs for faster payments</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>
            <a href="#dashboard" className="transition hover:text-white">
              Dashboard
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-xl transition hover:bg-white/10 md:inline-flex"
            >
              Login
            </a>
            <a
              href="/signup"
              className="inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Start
            </a>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Used for approvals, proof-of-work, and invoice tracking
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-7xl">
              Stop chasing payments.
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                Make every invoice impossible to ignore.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 md:text-xl">
              PayProof AI helps freelancers and agencies collect deliverables,
              attach proof files, generate approval-ready summaries, and track
              what is approved, billed, paid, or overdue from one clean system.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(255,255,255,0.15)]"
              >
                Start
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/10"
              >
                See Dashboard
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                <p className="text-sm text-white/50">Collect</p>
                <h3 className="mt-2 text-lg font-semibold">Files & evidence</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                <p className="text-sm text-white/50">Generate</p>
                <h3 className="mt-2 text-lg font-semibold">Approval summaries</h3>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                <p className="text-sm text-white/50">Track</p>
                <h3 className="mt-2 text-lg font-semibold">Invoices & payments</h3>
              </div>
            </div>
          </div>

          <div id="dashboard" className="relative">
            <div className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -right-10 bottom-8 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#0b1020]/90 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-white/45">Overview</p>
                    <h2 className="mt-1 text-2xl font-semibold">PayProof Dashboard</h2>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Live workspace
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <p className="text-sm text-white/50">Pending approvals</p>
                    <h3 className="mt-3 text-3xl font-semibold">12</h3>
                    <p className="mt-2 text-xs text-amber-300">+3 waiting today</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                    <p className="text-sm text-white/50">Unpaid invoices</p>
                    <h3 className="mt-3 text-3xl font-semibold">$4,250</h3>
                    <p className="mt-2 text-xs text-cyan-300">6 active invoices</p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Recent proof packs</p>
                      <p className="text-xs text-white/45">Latest activity</p>
                    </div>
                    <span className="text-xs text-white/45">Updated now</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#10172b] p-4 transition hover:border-cyan-400/30 hover:bg-white/5">
                      <div>
                        <p className="font-medium">Apex Retail Ltd</p>
                        <p className="text-sm text-white/45">
                          Website redesign proof pack
                        </p>
                      </div>
                      <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300">
                        Awaiting approval
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#10172b] p-4 transition hover:border-cyan-400/30 hover:bg-white/5">
                      <div>
                        <p className="font-medium">Nova Studio</p>
                        <p className="text-sm text-white/45">
                          SEO monthly invoice pack
                        </p>
                      </div>
                      <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs text-cyan-300">
                        Sent
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#10172b] p-4 transition hover:border-cyan-400/30 hover:bg-white/5">
                      <div>
                        <p className="font-medium">Bright Labs</p>
                        <p className="text-sm text-white/45">
                          App UI revision deliverables
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                        Paid
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 p-4">
                    <p className="text-xs text-white/50">Proof packs</p>
                    <h4 className="mt-2 text-xl font-semibold">28</h4>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-500/15 to-fuchsia-500/5 p-4">
                    <p className="text-xs text-white/50">Approved</p>
                    <h4 className="mt-2 text-xl font-semibold">19</h4>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4">
                    <p className="text-xs text-white/50">Paid</p>
                    <h4 className="mt-2 text-xl font-semibold">14</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 rounded-3xl border border-white/10 bg-white/10 px-5 py-4 shadow-xl backdrop-blur-xl">
              <p className="text-xs text-white/50">Performance</p>
              <p className="mt-1 text-lg font-semibold">Invoices paid 68% faster</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 pb-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            A product that feels clean, clear, and trustworthy
          </h2>
          <p className="mt-4 text-white/60">
            Modern SaaS products win with clarity. Everything should feel easy,
            reliable, and premium.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              01
            </div>
            <h3 className="text-xl font-semibold">Deliverable tracking</h3>
            <p className="mt-3 leading-7 text-white/60">
              Organize completed work, notes, files, screenshots, and proof in
              one timeline.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-400/10 text-fuchsia-300">
              02
            </div>
            <h3 className="text-xl font-semibold">Approval-ready proof packs</h3>
            <p className="mt-3 leading-7 text-white/60">
              Turn scattered updates into one client-facing summary that is easy
              to review and approve.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
              03
            </div>
            <h3 className="text-xl font-semibold">Invoice status control</h3>
            <p className="mt-3 leading-7 text-white/60">
              See what is pending, approved, billed, due, paid, or overdue
              without spreadsheet chaos.
            </p>
          </div>
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl md:p-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <p className="text-sm text-cyan-300">Step 1</p>
              <h3 className="mt-3 text-xl font-semibold">Log work</h3>
              <p className="mt-3 text-white/60">
                Add deliverables, notes, dates, and files.
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-300">Step 2</p>
              <h3 className="mt-3 text-xl font-semibold">Create proof</h3>
              <p className="mt-3 text-white/60">
                Generate a clear summary for client review.
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-300">Step 3</p>
              <h3 className="mt-3 text-xl font-semibold">Send invoice</h3>
              <p className="mt-3 text-white/60">
                Attach proof and invoice with confidence.
              </p>
            </div>
            <div>
              <p className="text-sm text-cyan-300">Step 4</p>
              <h3 className="mt-3 text-xl font-semibold">Track payment</h3>
              <p className="mt-3 text-white/60">
                Monitor due, paid, and overdue status in one place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
