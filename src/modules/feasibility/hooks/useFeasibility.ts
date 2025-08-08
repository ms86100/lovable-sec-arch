import { useQuery } from "@tanstack/react-query";
import * as api from "../api/feasibility";

export function useTechnicalFeasibility(projectId?: string) {
  return useQuery({
    queryKey: ["feasibility-technical", { projectId }],
    queryFn: () => (projectId ? api.getTechnical(projectId) : Promise.resolve(null)),
    enabled: !!projectId,
  });
}

export function useFinancialFeasibility(projectId?: string) {
  return useQuery({
    queryKey: ["feasibility-financial", { projectId }],
    queryFn: () => (projectId ? api.getFinancial(projectId) : Promise.resolve(null)),
    enabled: !!projectId,
  });
}

export function useOperationalFeasibility(projectId?: string) {
  return useQuery({
    queryKey: ["feasibility-operational", { projectId }],
    queryFn: () => (projectId ? api.getOperational(projectId) : Promise.resolve(null)),
    enabled: !!projectId,
  });
}
