import { supabase } from "@/services/supabaseClient";

export type FeasibilityAssessment = { score: number; notes?: string };

export async function getTechnical(projectId: string) {
  // Placeholder – implement Supabase query
  return { score: 0 } as FeasibilityAssessment;
}

export async function getFinancial(projectId: string) {
  // Placeholder – implement Supabase query
  return { score: 0 } as FeasibilityAssessment;
}

export async function getOperational(projectId: string) {
  // Placeholder – implement Supabase query
  return { score: 0 } as FeasibilityAssessment;
}
