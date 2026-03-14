"use client";

import { FormEvent, useEffect, useState } from "react";
import AppShell from "../../components/app-shell";
import PageCard from "../../components/page-card";
import { supabase } from "../../lib/supabase";

type Client = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string | null;
  client_id?: string | null;
  clients?: { name: string } | null;
};

export default function ProjectsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClientId, setEditClientId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadData = async () => {
    const { data: clientData } = await supabase
      .from("clients")
      .select("id, name")
      .order("created_at", { ascending: false });

    const { data: projectData } = await supabase
      .from("projects")
      .select("id, name, description, status, client_id, clients(name)")
      .order("created_at", { ascending: false });

    setClients(clientData || []);
    setProjects((projectData as any) || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddProject = async (e: FormEvent) => {
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

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      client_id: clientId,
      name,
      description,
      status: "active",
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setClientId("");
    setName("");
    setDescription("");
    setMsg("Project added successfully.");
    loadData();
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Project deleted.");
    loadData();
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setEditClientId(project.client_id || "");
    setEditName(project.name || "");
    setEditDescription(project.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditClientId("");
    setEditName("");
    setEditDescription("");
  };

  const handleUpdateProject = async (id: string) => {
    const { error } = await supabase
      .from("projects")
      .update({
        client_id: editClientId,
        name: editName,
        description: editDescription,
      })
      .eq("id", id);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Project updated.");
    cancelEdit();
    loadData();
  };

  return (
    <AppShell title="Projects" subtitle="Track and manage all client projects.">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <PageCard title="Add Project" subtitle="Create a new project">
          <form onSubmit={handleAddProject} className="space-y-4">
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

            <input
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
              {loading ? "Saving..." : "Add Project"}
            </button>
          </form>
        </PageCard>

        <PageCard title="Project List" subtitle="Only real projects from your database">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-white/50">No projects added yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  {editingId === project.id ? (
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

                      <input
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />

                      <textarea
                        className="w-full rounded-2xl border border-white/10 bg-[#11182b] px-4 py-3 text-white"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateProject(project.id)}
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
                        <p className="font-semibold">{project.name}</p>
                        <p className="text-sm text-white/50">
                          Client: {project.clients?.name || "Unknown"}
                        </p>
                        <p className="mt-1 text-sm text-white/40">
                          {project.description || "No description"}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                          {project.status || "active"}
                        </span>
                        <button
                          onClick={() => startEdit(project)}
                          className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
                        >
                          Modify
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
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