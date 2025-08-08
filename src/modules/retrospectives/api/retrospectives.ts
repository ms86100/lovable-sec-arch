import { supabase } from "@/services/supabaseClient";

export type DbRetrospective = {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
};

export async function listRetrospectives(projectId: string) {
  // Placeholder – implement Supabase query
  return [] as DbRetrospective[];
}

export async function upsertRetrospective(retro: Partial<DbRetrospective>) {
  // Placeholder – implement Supabase upsert
  return retro as DbRetrospective;
}
