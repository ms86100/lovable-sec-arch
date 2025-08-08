import { supabase } from "@/services/supabaseClient";

export type WorkItem = {
  id: string;
  title: string;
  status: string;
  parent_id?: string | null;
};

export async function listWorkItems(projectId: string) {
  // Placeholder – implement Supabase query
  return [] as WorkItem[];
}

export async function upsertWorkItem(item: Partial<WorkItem>) {
  // Placeholder – implement Supabase upsert
  return item as WorkItem;
}
