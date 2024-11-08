import type { DbDataEntryWithUser } from '@/lib/supabase/client';

interface DataEntryListProps {
  entries: DbDataEntryWithUser[];
}

export function DataEntryList({ entries }: DataEntryListProps) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <div key={entry.id} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{entry.title}</h3>
          <p className="mt-2 text-gray-600">{entry.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            Created by: {entry.user.name} ({entry.user.email})
          </div>
        </div>
      ))}
    </div>
  );
}