import { useQuery } from "@tanstack/react-query";
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
