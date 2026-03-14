"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppShell from "../../components/app-shell";
import PageCard from "../../components/page-card";
import StatCard from "../../components/stat-card";

type DeliverableRow = {
  id: string;
  title: string;
  summary_status: string | null;
  amount: number | null;
  clients?: { name: string } | null;
  projects?: { name: string } | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [stats, setStats] = useState({
    approvals: 0,
    projects: 0,
    unpaidInvoices: 0,
    paidTotal: 0,
  });
  const [recentDeliverables, setRecentDeliverables] = useState<DeliverableRow[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", authData.user.id)
        .single();

      if (!profile || profile.subscription_status !== "active") {
        router.push("/pricing");
        return;
      }

      const { count: approvalsCount } = await supabase
        .from("deliverables")
        .select("*", { count: "exact", head: true })
        .eq("summary_status", "pending_approval");

      const { count: projectsCount } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });

      const { data: unpaidInvoices } = await supabase
        .from("invoices")
        .select("amount,status")
        .in("status", ["unpaid", "draft"]);

      const { data: paidInvoices } = await supabase
        .from("invoices")
        .select("amount,status")
        .eq("status", "paid");

      const unpaidTotal =
        unpaidInvoices?.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 0;

      const paidTotal =
        paidInvoices?.reduce((sum, item) => sum + Number(item.amount || 0), 0) || 0;

      const { data: recentData } = await supabase
        .from("deliverables")
        .select("id,title,summary_status,amount,clients(name),projects(name)")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        approvals: approvalsCount || 0,
        projects: projectsCount || 0,
        unpaidInvoices: unpaidTotal,
        paidTotal,
      });

      setRecentDeliverables((recentData as any) || []);
      setChecking(false);
    };

    loadDashboard();
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#060816] text-white">
        <p className="text-white/70 text-lg">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle="A premium overview of approvals, deliverables, invoices, and payments."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending approvals" value={String(stats.approvals)} hint="Waiting for review" />
        <StatCard label="Active projects" value={String(stats.projects)} hint="Currently in workspace" />
        <StatCard label="Unpaid invoices" value={`$${stats.unpaidInvoices.toFixed(2)}`} hint="Draft + unpaid invoices" />
        <StatCard label="Paid total" value={`$${stats.paidTotal.toFixed(2)}`} hint="Collected invoices" />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
        <PageCard title="Recent proof packs" subtitle="Recent deliverables with full details.">
          <div className="space-y-4">
            {recentDeliverables.length === 0 ? (
              <p className="text-white/50">No recent deliverables yet.</p>
            ) : (
              recentDeliverables.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-medium">{item.clients?.name || "Unknown client"}</p>
                    <p className="text-sm text-white/45">
                      {item.title} • {item.projects?.name || "Unknown project"}
                    </p>
                    <p className="mt-1 text-sm text-white/40">
                      Amount: ${Number(item.amount || 0).toFixed(2)}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                    {item.summary_status || "pending_approval"}
                  </span>
                </div>
              ))
            )}
          </div>
        </PageCard>

        <PageCard title="Live totals" subtitle="Real figures from your current workspace.">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-5">
              <p className="text-sm text-white/45">Pending approvals</p>
              <h3 className="mt-2 text-3xl font-semibold">{stats.approvals}</h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-500/5 p-5">
              <p className="text-sm text-white/45">Projects</p>
              <h3 className="mt-2 text-3xl font-semibold">{stats.projects}</h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-5">
              <p className="text-sm text-white/45">Paid total</p>
              <h3 className="mt-2 text-3xl font-semibold">${stats.paidTotal.toFixed(2)}</h3>
            </div>
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}