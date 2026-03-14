import { ReactNode } from "react";

type PageCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function PageCard({ title, subtitle, children }: PageCardProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0b1020] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="rounded-[1.5rem] border border-white/10 bg-[#0f1529] p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-white/50">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
