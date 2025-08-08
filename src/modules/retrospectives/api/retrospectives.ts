import { supabase } from "@/services/supabaseClient";

export type DbRetrospective = {
  id: string;
  project_id: string;
  iteration_id?: string | null;
  date: string;
  facilitator?: string | null;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export type DbLesson = {
  id: string;
  retrospective_id: string;
  type?: string | null;
  description: string;
  impact?: string | null;
  categories?: string[] | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type DbRCA = {
  id: string;
  retrospective_id: string;
  method: string;
  content: any;
  linked_lesson_id?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type DbAction = {
  id: string;
  retrospective_id: string;
  title: string;
  description?: string | null;
  owner_id?: string | null;
  due_date?: string | null;
  status: string;
  linked_task_id?: string | null;
  target_iteration_id?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

export async function listRetrospectives(projectId: string) {
  const { data, error } = await supabase
    .from("retrospectives")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []) as DbRetrospective[];
}

export async function upsertRetrospective(retro: Partial<DbRetrospective>) {
  const { data, error } = await supabase
    .from("retrospectives")
    .upsert(retro as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbRetrospective | null;
}

export async function setRetrospectiveStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("retrospectives")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbRetrospective | null;
}

export async function listLessons(retrospectiveId: string) {
  const { data, error } = await supabase
    .from("retrospective_lessons")
    .select("*")
    .eq("retrospective_id", retrospectiveId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as DbLesson[];
}

export async function upsertLesson(lesson: Partial<DbLesson>) {
  const { data, error } = await supabase
    .from("retrospective_lessons")
    .upsert(lesson as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbLesson | null;
}

export async function listRCA(retrospectiveId: string) {
  const { data, error } = await supabase
    .from("retrospective_rca")
    .select("*")
    .eq("retrospective_id", retrospectiveId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as DbRCA[];
}

export async function upsertRCA(rca: Partial<DbRCA>) {
  const { data, error } = await supabase
    .from("retrospective_rca")
    .upsert(rca as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbRCA | null;
}

export async function listActions(retrospectiveId: string) {
  const { data, error } = await supabase
    .from("retrospective_actions")
    .select("*")
    .eq("retrospective_id", retrospectiveId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as DbAction[];
}

export async function upsertAction(action: Partial<DbAction>) {
  const { data, error } = await supabase
    .from("retrospective_actions")
    .upsert(action as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbAction | null;
}

export async function setActionStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("retrospective_actions")
    .update({ status })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbAction | null;
}
