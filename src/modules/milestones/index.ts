// Barrel file for Milestones module
export { CPMAnalysis } from "@/components/milestones/CPMAnalysis";
export { CPMGanttChart } from "@/components/milestones/CPMGanttChart";
export { CPMDiagram } from "@/components/milestones/CPMDiagram";
export { VersionOneSync } from "./components/VersionOneSync";
export { TaskList } from "./components/TaskList";

// API + hooks
export * as MilestonesAPI from "./api/tasks";
export * from "./hooks/useTasks";
