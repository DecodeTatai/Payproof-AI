"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "../../components/app-shell";
import PageCard from "../../components/page-card";
import { supabase } from "../../lib/supabase";

type Client = { id: string; name: string };
type Project = { id: string; name: string };

type Deliverable = {
  id: string;
  title: string;
  description: string | null;
  summary_status: string | null;
  amount: number | null;
  client_id?: string | null;
  project_id?: string | null;
  clients?: { name: string } | null;
  projects?: { name: string } | null;
};

export default function DeliverablesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending_approval");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClientId, setEditClientId] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("pending_approval");

  const loadData = async () => {
    const { data: clientData } = await supabase
      .from("clients")
      .select("id, name")
      .order("created_at", { ascending: false });

    const { data: projectData } = await supabase
      .from("projects")
      .select("id, name")
      .order("created_at", { ascending: false });

    const { data: deliverableData } = await supabase
      .from("deliverables")
      .select("id,title,description,summary_status,amount,client_id,project_id,clients(name),projects(name)")
      .order("created_at", { ascending: false });

    setClients(clientData || []);
    setProjects(projectData || []);
    setDeliverables((deliverableData as any) || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const syncInvoiceForDeliverable = async ({
    deliverableId,
    userId,
    clientId,
    projectId,
    title,
    amount,
    status,
  }: {
    deliverableId: string;
    userId: string;
    clientId: string;
    projectId: string;
    title: string;
    amount: number;
    status: string;
  }) => {
    const invoiceStatus = status === "paid" ? "paid" : "unpaid";
    const shouldHaveInvoice = status === "billed" || status === "paid";

    const { data: existingInvoice } = await supabase
      .from("invoices")
      .select("id")
      .eq("deliverable_id", deliverableId)
      .maybeSingle();

    if (!shouldHaveInvoice) {
      if (existingInvoice?.id) {
        await supabase.from("invoices").delete().eq("id", existingInvoice.id);
      }
      return;
    }

    if (existingInvoice?.id) {
      await supabase
        .from("invoices")
        .update({
          client_id: clientId,
          project_id: projectId,
          amount,
          status: invoiceStatus,
          notes: title,
        })
        .eq("id", existingInvoice.id);
      return;
    }

    await supabase.from("invoices").insert({
      user_id: userId,
      client_id: clientId,
      project_id: projectId,
      deliverable_id: deliverableId,
      invoice_number: `INV-${Date.now()}`,
      amount,
      status: invoiceStatus,
      notes: title,
    });
  };

  const handleAddDeliverable = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setMsg("Please login first.");
      setLoading(false);
      return;
    }

    const finalAmount = Number(amount || 0);

    const { data: insertedDeliverable, error } = await supabase
      .from("deliverables")
      .insert({
        user_id: user.id,
        client_id: clientId,
        project_id: projectId,
        title,
        description,
        amount: finalAmount,
        summary_status: status,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }

    await syncInvoiceForDeliverable({
      deliverableId: insertedDeliverable.id,
      userId: user.id,
      clientId,
      projectId,
      title,
      amount: finalAmount,
      status,
    });

    setClientId("");
    setProjectId("");
    setTitle("");
    setDescription("");
    setAmount("");
    setStatus("pending_approval");
    setLoading(false);
    setMsg("Deliverable added successfully.");
    loadData();
  };

  const handleDeleteDeliverable = async (id: string) => {
    setMsg("");

    await supabase.from("invoices").delete().eq("deliverable_id", id);

    const { error } = await supabase.from("deliverables").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Deliverable deleted.");
    loadData();
  };

  const startEdit = (item: Deliverable) => {
    setEditingId(item.id);
    setEditClientId(item.client_id || "");
    setEditProjectId(item.project_id || "");
    setEditTitle(item.title || "");
    setEditDescription(item.description || "");
    setEditAmount(String(item.amount || 0));
    setEditStatus(item.summary_status || "pending_approval");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditClientId("");
    setEditProjectId("");
    setEditTitle("");
    setEditDescription("");
    setEditAmount("");
    setEditStatus("pending_approval");
  };

  const handleUpdateDeliverable = async (id: string) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setMsg("Please login first.");
      return;
    }

    const finalAmount = Number(editAmount || 0);

    const { error } = await supabase
      .from("deliverables")
      .update({
        client_id: editClientId,
        project_id: editProjectId,
        title: editTitle,
        description: editDescription,
        amount: finalAmount,
        summary_status: editStatus,
      })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    await syncInvoiceForDeliverable({
      deliverableId: id,
      userId: user.id,
      clientId: editClientId,
      projectId: editProjectId,
      title: editTitle,
      amount: finalAmount,
      status: editStatus,
    });

    setMsg("Deliverable updated.");
    cancelEdit();
    loadData();
  };

  return (
    <AppShell title="Deliverables" subtitle="Track completed work items.">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <PageCard title="Add Deliverable" subtitle="Save a completed work item">
          <form onSubmit={handleAddDeliverable} className="space-y-4">
            <select
              className="dark-select w-full rounded-2xl px-4 py-3"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <select
              className="dark-select w-full rounded-2xl px-4 py-3"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Deliverable title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="dark-select w-full rounded-2xl px-4 py-3"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending_approval">Pending approval</option>
              <option value="approved">Approved</option>
              <option value="billed">Billed</option>
              <option value="paid">Paid</option>
            </select>

            {msg && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:scale-[1.01] disabled:opacity-70"
            >
              {loading ? "Saving..." : "Add Deliverable"}
            </button>
          </form>
        </PageCard>

        <PageCard title="Deliverables" subtitle="Real saved deliverables with project and client details">
          <div className="space-y-4">
            {deliverables.length === 0 ? (
              <p className="text-white/50">No deliverables yet.</p>
            ) : (
              deliverables.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <select
                        className="dark-select w-full rounded-2xl px-4 py-3"
                        value={editClientId}
                        onChange={(e) => setEditClientId(e.target.value)}
                      >
                        <option value="">Select client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>

                      <select
                        className="dark-select w-full rounded-2xl px-4 py-3"
                        value={editProjectId}
                        onChange={(e) => setEditProjectId(e.target.value)}
                      >
                        <option value="">Select project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>

                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />

                      <textarea
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />

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
                        <option value="pending_approval">Pending approval</option>
                        <option value="approved">Approved</option>
                        <option value="billed">Billed</option>
                        <option value="paid">Paid</option>
                      </select>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateDeliverable(item.id)}
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
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-white/50">
                          {item.clients?.name || "Unknown client"} • {item.projects?.name || "Unknown project"}
                        </p>
                        <p className="mt-1 text-sm text-white/40">
                          {item.description || "No description"}
                        </p>
                        <p className="mt-3 text-sm text-white/55">
                          Amount: ${Number(item.amount || 0).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                          {item.summary_status || "pending_approval"}
                        </span>

                        <div className="flex gap-3">
                          <button
                            onClick={() => startEdit(item)}
                            className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => handleDeleteDeliverable(item.id)}
                            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </PageCard>
      </div>
    </AppShell>
  );
}