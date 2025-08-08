import { supabase } from "@/services/supabaseClient";

export type VelocityPoint = { iteration: string; points: number };
export type BurndownPoint = { day: string; remaining: number };

export type DbScenario = {
  id: string;
  project_id: string;
  variables: any;
  result_summary?: any;
  created_at: string;
  updated_at?: string;
};

export async function getVelocity(projectId: string) {
  // Placeholder – implement Supabase query later
  return [] as VelocityPoint[];
}

export async function getBurndown(projectId: string) {
  // Placeholder – implement Supabase query later
  return [] as BurndownPoint[];
}

export async function listScenarios(projectId: string) {
  const { data, error } = await supabase
    .from("what_if_scenarios")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as DbScenario[];
}

export async function upsertScenario(s: Partial<DbScenario>) {
  const { data, error } = await supabase
    .from("what_if_scenarios")
    .upsert(s as any)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as DbScenario | null;
}

export async function runWhatIf(projectId: string, variables: Record<string, number>) {
  // Simple client-side estimation for now; can be replaced by Edge Function later
  const velocityChange = variables.velocity_change_percent || 0; // e.g., +10 means faster
  const resourceLossDays = variables.resource_loss_days || 0;
  const scopeIncrease = variables.scope_increase_percent || 0;

  const timeline_shift_days = Math.max(0, resourceLossDays + Math.round(scopeIncrease / 10) - Math.round(velocityChange / 10));
  const capacity_impact_percent = scopeIncrease - velocityChange;

  const summary = { timeline_shift_days, capacity_impact_percent };
  const saved = await upsertScenario({ project_id: projectId, variables, result_summary: summary });
  return saved ?? { id: "", project_id: projectId, variables, result_summary: summary, created_at: new Date().toISOString() };
}
