"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "../../components/app-shell";
import PageCard from "../../components/page-card";
import { supabase } from "../../lib/supabase";

type Client = {
  id: string;
  name: string;
  email: string | null;
  company_name: string | null;
};

export default function ClientsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCompanyName, setEditCompanyName] = useState("");

  const loadClients = async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    setClients(data || []);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAddClient = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setMsg("Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("clients").insert({
      user_id: user.id,
      name,
      email,
      company_name: companyName,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setName("");
    setEmail("");
    setCompanyName("");
    setMsg("Client added successfully.");
    loadClients();
  };

  const handleDeleteClient = async (id: string) => {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Client deleted.");
    loadClients();
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setEditName(client.name || "");
    setEditEmail(client.email || "");
    setEditCompanyName(client.company_name || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditEmail("");
    setEditCompanyName("");
  };

  const handleUpdateClient = async (id: string) => {
    const { error } = await supabase
      .from("clients")
      .update({
        name: editName,
        email: editEmail,
        company_name: editCompanyName,
      })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Client updated.");
    cancelEdit();
    loadClients();
  };

  return (
    <AppShell title="Clients" subtitle="Manage your client directory.">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <PageCard title="Add Client" subtitle="Create a new client record">
          <form onSubmit={handleAddClient} className="space-y-4">
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Client name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Client email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            {msg && (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black"
            >
              {loading ? "Saving..." : "Add Client"}
            </button>
          </form>
        </PageCard>

        <PageCard title="Client List" subtitle="All your saved clients">
          <div className="space-y-4">
            {clients.length === 0 ? (
              <p className="text-white/50">No clients added yet.</p>
            ) : (
              clients.map((client) => (
                <div key={client.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  {editingId === client.id ? (
                    <div className="space-y-3">
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editCompanyName}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateClient(client.id)}
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
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm text-white/50">{client.email || "No email"}</p>
                        <p className="text-sm text-white/40">{client.company_name || "No company"}</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(client)}
                          className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200"
                        >
                          Delete
                        </button>
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