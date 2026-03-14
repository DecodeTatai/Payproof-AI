type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0d1327] to-[#0a1020] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      <p className="text-sm text-white/45">{label}</p>
      <h3 className="mt-3 text-5xl font-semibold tracking-tight text-white">{value}</h3>
      {hint && <p className="mt-3 text-sm text-white/40">{hint}</p>}
    </div>
  );
}
