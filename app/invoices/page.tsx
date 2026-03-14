"use client";

import { useEffect, useState } from "react";
import AppShell from "../../components/app-shell";
import PageCard from "../../components/page-card";
import { supabase } from "../../lib/supabase";

type Invoice = {
  id: string;
  invoice_number: string | null;
  amount: number | null;
  status: string | null;
  notes: string | null;
  clients?: { name: string } | null;
  projects?: { name: string } | null;
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("draft");
  const [editNotes, setEditNotes] = useState("");

  const loadInvoices = async () => {
    const { data } = await supabase
      .from("invoices")
      .select("id,invoice_number,amount,status,notes,clients(name),projects(name)")
      .order("created_at", { ascending: false });

    setInvoices((data as any) || []);
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const updateInvoiceStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Invoice status updated.");
    loadInvoices();
  };

  const deleteInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Invoice deleted.");
    loadInvoices();
  };

  const startEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setEditAmount(String(invoice.amount || 0));
    setEditStatus(invoice.status || "draft");
    setEditNotes(invoice.notes || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
    setEditStatus("draft");
    setEditNotes("");
  };

  const handleUpdateInvoice = async (id: string) => {
    const { error } = await supabase
      .from("invoices")
      .update({
        amount: Number(editAmount || 0),
        status: editStatus,
        notes: editNotes,
      })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Invoice updated.");
    cancelEdit();
    loadInvoices();
  };

  return (
    <AppShell title="Invoices" subtitle="Track paid and unpaid invoices.">
      <PageCard title="Invoice List" subtitle="Real invoices connected to billed or paid deliverables">
        {msg && (
          <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            {msg}
          </div>
        )}

        <div className="space-y-4">
          {invoices.length === 0 ? (
            <p className="text-white/50">No invoices yet.</p>
          ) : (
            invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {editingId === invoice.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                    />

                    <select
                      className="dark-select w-full rounded-2xl px-4 py-3"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                    </select>

                    <textarea
                      className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleUpdateInvoice(invoice.id)}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{invoice.invoice_number || "Draft Invoice"}</p>
                        <p className="text-sm text-white/50">
                          {invoice.clients?.name || "Unknown client"} • {invoice.projects?.name || "Unknown project"}
                        </p>
                        <p className="mt-1 text-sm text-white/40">
                          {invoice.notes || "No notes"}
                        </p>
                        <p className="mt-3 text-sm text-white/55">
                          Amount: ${Number(invoice.amount || 0).toFixed(2)}
                        </p>
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                        {invoice.status || "unpaid"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, "draft")}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                      >
                        Mark Draft
                      </button>

                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, "unpaid")}
                        className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-200"
                      >
                        Mark Unpaid
                      </button>

                      <button
                        onClick={() => updateInvoiceStatus(invoice.id, "paid")}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
                      >
                        Mark Paid
                      </button>

                      <button
                        onClick={() => startEdit(invoice)}
                        className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                      >
                        Modify
                      </button>

                      <button
                        onClick={() => deleteInvoice(invoice.id)}
                        className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </PageCard>
    </AppShell>
  );
}