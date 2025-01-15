// app/dashboard/layout.tsx
import type { Metadata } from "next";
import DashboardClientLayout from "./_client"; // The client layout

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Restaurant management dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // (Server checks, server fetching, etc. if needed)
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
