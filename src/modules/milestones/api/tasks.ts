import { supabase } from "@/services/supabaseClient";

export type DbTask = {
  id: string;
  title: string;
  estimated_effort_hours?: number | null;
  dependencies?: any;
  milestone_id: string;
  project_id?: string;
};

export async function listTasksByProject(projectId: string) {
  const { data: milestones } = await supabase
    .from("project_milestones")
    .select("id")
    .eq("project_id", projectId);

  const ids = (milestones || []).map((m: any) => m.id);
  if (ids.length === 0) return [] as DbTask[];

  const { data, error } = await supabase
    .from("project_tasks")
    .select("id,title,estimated_effort_hours,dependencies,milestone_id")
    .in("milestone_id", ids)
    .order("title");
  if (error) throw error;
  return (data || []) as DbTask[];
}

export async function listTasksByMilestone(milestoneId: string) {
  const { data, error } = await supabase
    .from("project_tasks")
    .select("id,title,estimated_effort_hours,dependencies,milestone_id")
    .eq("milestone_id", milestoneId)
    .order("title");
  if (error) throw error;
  return (data || []) as DbTask[];
}

export async function upsertTask(task: Partial<DbTask>) {
  // Cast to any to satisfy generated Supabase types; ensure milestone_id is provided by caller
  const { data, error } = await supabase
    .from("project_tasks")
    .upsert(task as any)
    .select()
    .single();
  if (error) throw error;
  return data as DbTask;
}
