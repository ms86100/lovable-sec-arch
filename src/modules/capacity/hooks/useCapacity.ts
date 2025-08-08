import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/capacity";

export function useVelocity(projectId?: string) {
  return useQuery({
    queryKey: ["capacity-velocity", { projectId }],
    queryFn: () => (projectId ? api.getVelocity(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useBurndown(projectId?: string) {
  return useQuery({
    queryKey: ["capacity-burndown", { projectId }],
    queryFn: () => (projectId ? api.getBurndown(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useScenarios(projectId?: string) {
  return useQuery({
    queryKey: ["what-if-scenarios", { projectId }],
    queryFn: () => (projectId ? api.listScenarios(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useRunWhatIf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, variables }: { projectId: string; variables: Record<string, number> }) => api.runWhatIf(projectId, variables),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["what-if-scenarios"] }),
  });
}
