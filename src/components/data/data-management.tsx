"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data/data-table";
import { EditForm } from "@/components/data/edit-form";
import { useToast } from "../ui/use-toast";
import { Plus } from "lucide-react";

type DataEntry = {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
};

interface DataManagementProps {
  initialData: DataEntry[];
}

export function DataManagement({ initialData }: DataManagementProps) {
  const [data, setData] = useState<DataEntry[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const handleEdit = (entry: DataEntry) => {
    setEditingEntry(entry);
    setIsEditFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("data_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setData((prev) => prev.filter((entry) => entry.id !== id));
      toast({
        title: "Entry deleted",
        description: "The entry has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: { name: string; random_number: number }) => {
    try {
      setIsLoading(true);
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("data_entries")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingEntry.id);

        if (error) throw error;

        toast({
          title: "Entry updated",
          description: "The entry has been successfully updated.",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from("data_entries")
          .insert([
            {
              ...formData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (error) throw error;

        toast({
          title: "Entry created",
          description: "The new entry has been successfully created.",
        });
      }
      
      router.refresh();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save the entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsEditFormOpen(false);
      setEditingEntry(null);
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => {
            setEditingEntry(null);
            setIsEditFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Entry
        </Button>
      </div>

      <DataTable
        data={data}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingEntry(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEntry || undefined}
        isLoading={isLoading}
      />
    </>
  );
}