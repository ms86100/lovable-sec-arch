// Adapter stub for external ALM (e.g., VersionOne). Replace with real API calls.
export async function syncVersionOneTasks(projectId: string) {
  console.info("[versionone] syncTasks called for project:", projectId);
  // TODO: implement real sync via Edge Function + provider API
  return { synced: 0, projectId };
}
