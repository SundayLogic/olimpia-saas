
import { createServerClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/users/users-table";
import InviteUser from "@/components/users/invite-user";

export default async function UsersPage() {
  const supabase = createServerClient();

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error:", error);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your users here.</p>
        </div>
        <InviteUser />
      </div>
      <UsersTable initialData={users || []} />
    </div>
  );
}