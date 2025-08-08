import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/tasks";

export function useProjectTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", { projectId }],
    queryFn: () => (projectId ? api.listTasksByProject(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useMilestoneTasks(milestoneId?: string) {
  return useQuery({
    queryKey: ["tasks", { milestoneId }],
    queryFn: () => (milestoneId ? api.listTasksByMilestone(milestoneId) : Promise.resolve([])),
    enabled: !!milestoneId,
  });
}

export function useUpsertTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
