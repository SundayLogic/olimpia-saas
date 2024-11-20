"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import UserList from "@/components/features/users/UserList";
import InviteUserDialog from "@/components/features/users/InviteUserDialog";
import type { User } from "@/types/users";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [supabase, toast]);

  // Handle user status toggle
  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, active: isActive } : user
        )
      );

      toast({
        title: "Success",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  // Handle user invitation
  const handleInviteUser = async (email: string, role: string) => {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingUser) {
        toast({
          title: "Error",
          description: "This email is already registered",
          variant: "destructive",
        });
        return;
      }

      // Send invitation
      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        email,
        { data: { role } }
      );

      if (inviteError) throw inviteError;

      // Create user record
      const { error: createError } = await supabase
        .from('users')
        .insert([{
          email,
          role,
          active: false,
          name: email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }]);

      if (createError) throw createError;

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });

      setIsInviteDialogOpen(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user access and permissions
          </p>
        </div>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="space-y-4">
        {/* User List Component */}
        <UserList
          users={users}
          isLoading={isLoading}
          onStatusChange={handleUserStatusChange}
        />

        {/* Invite User Dialog */}
        <InviteUserDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          onInvite={handleInviteUser}
        />
      </div>
    </div>
  );
}