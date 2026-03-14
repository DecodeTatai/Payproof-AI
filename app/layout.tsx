import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PayProof AI",
  description: "Stop Chasing Payments - Create a Proof-of-Work Pack Instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
