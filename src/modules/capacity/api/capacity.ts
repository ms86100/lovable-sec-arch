import { supabase } from "@/services/supabaseClient";

export type VelocityPoint = { iteration: string; points: number };
export type BurndownPoint = { day: string; remaining: number };

export async function getVelocity(projectId: string) {
  // Placeholder – implement Supabase query
  return [] as VelocityPoint[];
}

export async function getBurndown(projectId: string) {
  // Placeholder – implement Supabase query
  return [] as BurndownPoint[];
}

export async function runWhatIf(projectId: string, params: Record<string, unknown>) {
  // Placeholder – implement What-if analysis
  return { impact: "placeholder" } as const;
}
