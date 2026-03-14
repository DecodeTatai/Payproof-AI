# PayProof AI

Stop Chasing Payments - Create a Proof-of-Work Pack Instantly.

Freelancers and small agencies can track deliverables, create approval summaries, and send invoice-ready proof packs.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run the following SQL in your Supabase SQL editor:

```sql
-- Clients table
create table clients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  email text,
  created_at timestamp with time zone default now()
);

-- Projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  client_id uuid references clients(id),
  name text not null,
  created_at timestamp with time zone default now()
);

-- Deliverables table
create table deliverables (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  client_id uuid references clients(id),
  project_id uuid references projects(id),
  title text not null,
  amount numeric default 0,
  summary_status text default 'pending',
  created_at timestamp with time zone default now()
);

-- Invoices table
create table invoices (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  invoice_number text,
  amount numeric default 0,
  status text default 'pending',
  due_date date,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table clients enable row level security;
alter table projects enable row level security;
alter table deliverables enable row level security;
alter table invoices enable row level security;

-- RLS Policies
create policy "Users can manage own clients" on clients for all using (auth.uid() = user_id);
create policy "Users can manage own projects" on projects for all using (auth.uid() = user_id);
create policy "Users can manage own deliverables" on deliverables for all using (auth.uid() = user_id);
create policy "Users can manage own invoices" on invoices for all using (auth.uid() = user_id);
```

### 3. Configure environment variables

Copy `.env.local` and fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under **Settings → API**.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
payproof-ai/
  app/
    page.tsx            ← Homepage / Landing
    layout.tsx          ← Root layout
    globals.css         ← Global styles
    login/page.tsx      ← Login page
    signup/page.tsx     ← Signup page
    dashboard/page.tsx  ← Dashboard with stats
    clients/page.tsx    ← Manage clients
    projects/page.tsx   ← Manage projects
    deliverables/page.tsx ← Track deliverables
    invoices/page.tsx   ← View invoices
  lib/
    supabase.ts         ← Supabase client
  .env.local            ← Environment variables
```

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + Database)
