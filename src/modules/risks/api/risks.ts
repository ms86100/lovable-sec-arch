import { supabase } from "@/services/supabaseClient";

export type DbRisk = {
  id: string;
  title: string;
  description?: string | null;
  severity_level: string;
  status: string;
  risk_score?: number | null;
  project_id: string;
  due_date?: string | null;
};

export async function listProjectRisks(projectId: string) {
  const { data, error } = await supabase
    .from("project_risks")
    .select("*")
    .eq("project_id", projectId)
    .order("risk_score", { ascending: false });
  if (error) throw error;
  return (data || []) as DbRisk[];
}

export async function listTopRisks(limit = 10) {
  const { data, error } = await supabase
    .from("project_risks")
    .select("*")
    .order("risk_score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []) as DbRisk[];
}
