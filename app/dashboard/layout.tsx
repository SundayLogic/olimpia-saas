// app/dashboard/layout.tsx (Server Component)
import type { Metadata } from "next";
import DashboardClientLayout from "./_client"; // <--- The new client layout

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Restaurant management dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Here you could do server checks, fetch data, etc.
  // Then pass the children to the client layout.

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
