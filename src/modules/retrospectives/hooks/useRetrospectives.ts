import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/retrospectives";

export function useRetrospectives(projectId?: string) {
  return useQuery({
    queryKey: ["retrospectives", { projectId }],
    queryFn: () => (projectId ? api.listRetrospectives(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useUpsertRetrospective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertRetrospective,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retrospectives"] }),
  });
}
