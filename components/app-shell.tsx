"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { supabase } from "../lib/supabase";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/projects", label: "Projects" },
  { href: "/deliverables", label: "Deliverables" },
  { href: "/invoices", label: "Invoices" },
];

export default function AppShell({ title, subtitle, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#060816] text-white">
      <div className="flex min-h-screen">
        <aside className="w-[250px] border-r border-white/10 bg-[#091121]">
          <div className="flex h-full flex-col px-6 py-8">
            <Link href="/dashboard" className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                <span className="text-lg font-bold">P</span>
              </div>
              <div>
                <p className="font-semibold">PayProof AI</p>
                <p className="text-sm text-white/45">Premium workspace</p>
              </div>
            </Link>

            <nav className="mt-10 space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 text-sm transition ${
                      active
                        ? "border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Workspace
              </p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight">
                Approvals, proof packs, and invoice tracking in one place
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/60">
                Keep every project organized with a clean premium workflow.
              </p>

              <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-[#060816]">
          <header className="border-b border-white/10 bg-[#0b1020] px-10 py-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-5xl font-semibold tracking-[-0.04em]">{title}</h1>
                {subtitle && (
                  <p className="mt-3 max-w-2xl text-lg text-white/55">{subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/75">
                  Premium Workspace
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                  U
                </div>
              </div>
            </div>
          </header>

          <div className="px-10 py-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
