import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { TableActions } from "./table-actions";

interface DataEntry {
  id: string;
  name: string;
  random_number: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

interface DataTableProps {
  data: DataEntry[];
  isLoading: boolean;
  onEdit: (entry: DataEntry) => void;
  onDelete: (id: string) => void;
}

export function DataTable({ data, isLoading, onEdit, onDelete }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Random Number</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.name}</TableCell>
              <TableCell>{entry.random_number}</TableCell>
              <TableCell>
                {new Date(entry.updated_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <TableActions 
                  onEdit={() => onEdit(entry)}
                  onDelete={() => onDelete(entry.id)}
                />
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}