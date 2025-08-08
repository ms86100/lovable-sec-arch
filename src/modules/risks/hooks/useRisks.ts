import { useQuery } from "@tanstack/react-query";
import * as api from "../api/risks";

export function useProjectRisks(projectId?: string) {
  return useQuery({
    queryKey: ["risks", { projectId }],
    queryFn: () => (projectId ? api.listProjectRisks(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useTopRisks(limit = 10) {
  return useQuery({
    queryKey: ["risks", { limit }],
    queryFn: () => api.listTopRisks(limit),
  });
}
