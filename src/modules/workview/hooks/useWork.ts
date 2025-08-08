import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/work";

export function useWorkItems(projectId?: string) {
  return useQuery({
    queryKey: ["work-items", { projectId }],
    queryFn: () => (projectId ? api.listWorkItems(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useUpsertWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertWorkItem,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["work-items"] }),
  });
}
