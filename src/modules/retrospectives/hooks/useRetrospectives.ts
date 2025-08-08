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

export function useLessons(retrospectiveId?: string) {
  return useQuery({
    queryKey: ["retrospective-lessons", { retrospectiveId }],
    queryFn: () => (retrospectiveId ? api.listLessons(retrospectiveId) : Promise.resolve([])),
    enabled: !!retrospectiveId,
  });
}

export function useUpsertLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertLesson,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retrospective-lessons"] }),
  });
}

export function useRCA(retrospectiveId?: string) {
  return useQuery({
    queryKey: ["retrospective-rca", { retrospectiveId }],
    queryFn: () => (retrospectiveId ? api.listRCA(retrospectiveId) : Promise.resolve([])),
    enabled: !!retrospectiveId,
  });
}

export function useUpsertRCA() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertRCA,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retrospective-rca"] }),
  });
}

export function useActions(retrospectiveId?: string) {
  return useQuery({
    queryKey: ["retrospective-actions", { retrospectiveId }],
    queryFn: () => (retrospectiveId ? api.listActions(retrospectiveId) : Promise.resolve([])),
    enabled: !!retrospectiveId,
  });
}

export function useUpsertAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.upsertAction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retrospective-actions"] }),
  });
}

export function useSetActionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.setActionStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["retrospective-actions"] }),
  });
}
