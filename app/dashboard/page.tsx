// app/dashboard/page.tsx
import { PageHeader } from "@/components/core/layout";

export default function DashboardPage() {
  return (
    <div className="container px-4 py-6">
      <PageHeader
        heading="Dashboard"
        text="Welcome to your restaurant management dashboard"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Add your dashboard content here */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold">Menu Items</h3>
          <p className="text-sm text-muted-foreground">Manage your menu items</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold">Users</h3>
          <p className="text-sm text-muted-foreground">Manage user access</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold">Daily Menu</h3>
          <p className="text-sm text-muted-foreground">Manage daily specials</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="font-semibold">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your restaurant</p>
        </div>
      </div>
    </div>
  );
}