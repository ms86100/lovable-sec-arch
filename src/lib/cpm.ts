// Critical Path Method (CPM) calculation utilities

export interface CPMTask {
  id: string
  title: string
  duration: number // in hours/days
  dependencies: string[] // array of task IDs
  earlyStart?: number
  earlyFinish?: number
  lateStart?: number
  lateFinish?: number
  slack?: number
  isCritical?: boolean
}

export interface CPMResult {
  tasks: CPMTask[]
  criticalPath: string[]
  projectDuration: number
  criticalTasks: CPMTask[]
}

/**
 * Calculate Critical Path Method for a list of tasks
 */
export function calculateCPM(tasks: CPMTask[]): CPMResult {
  // Create a map for quick task lookup
  const taskMap = new Map(tasks.map(task => [task.id, { ...task }]))
  
  // Initialize all tasks
  const processedTasks = tasks.map(task => ({
    ...task,
    earlyStart: 0,
    earlyFinish: 0,
    lateStart: 0,
    lateFinish: 0,
    slack: 0,
    isCritical: false
  }))

  // Forward pass - Calculate Early Start and Early Finish
  const sortedTasks = topologicalSort(processedTasks)
  
  for (const task of sortedTasks) {
    const taskData = taskMap.get(task.id)!
    
    // Calculate Early Start
    let maxEarlyFinish = 0
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId)
      if (depTask && depTask.earlyFinish !== undefined) {
        maxEarlyFinish = Math.max(maxEarlyFinish, depTask.earlyFinish)
      }
    }
    
    taskData.earlyStart = maxEarlyFinish
    taskData.earlyFinish = taskData.earlyStart + task.duration
    
    // Update the task in the map
    taskMap.set(task.id, taskData)
  }

  // Calculate project duration (maximum Early Finish)
  const projectDuration = Math.max(...Array.from(taskMap.values()).map(t => t.earlyFinish || 0))

  // Backward pass - Calculate Late Start and Late Finish
  const reversedTasks = [...sortedTasks].reverse()
  
  // Initialize tasks with no successors
  for (const task of reversedTasks) {
    const taskData = taskMap.get(task.id)!
    const successors = getSuccessors(task.id, processedTasks)
    
    if (successors.length === 0) {
      // No successors - this is an end task
      taskData.lateFinish = projectDuration
    } else {
      // Calculate Late Finish based on successors
      let minLateStart = Infinity
      for (const successorId of successors) {
        const successorTask = taskMap.get(successorId)
        if (successorTask && successorTask.lateStart !== undefined) {
          minLateStart = Math.min(minLateStart, successorTask.lateStart)
        }
      }
      taskData.lateFinish = minLateStart === Infinity ? projectDuration : minLateStart
    }
    
    taskData.lateStart = taskData.lateFinish - task.duration
    taskData.slack = taskData.lateStart - (taskData.earlyStart || 0)
    taskData.isCritical = taskData.slack === 0
    
    taskMap.set(task.id, taskData)
  }

  // Convert back to array
  const finalTasks = Array.from(taskMap.values())
  
  // Identify critical path
  const criticalTasks = finalTasks.filter(task => task.isCritical)
  const criticalPath = findCriticalPath(criticalTasks)

  return {
    tasks: finalTasks,
    criticalPath,
    projectDuration,
    criticalTasks
  }
}

/**
 * Topological sort for task scheduling
 */
function topologicalSort(tasks: CPMTask[]): CPMTask[] {
  const visited = new Set<string>()
  const visiting = new Set<string>()
  const result: CPMTask[] = []
  const taskMap = new Map(tasks.map(task => [task.id, task]))

  function visit(taskId: string) {
    if (visiting.has(taskId)) {
      throw new Error(`Circular dependency detected involving task: ${taskId}`)
    }
    
    if (visited.has(taskId)) {
      return
    }

    visiting.add(taskId)
    const task = taskMap.get(taskId)
    
    if (task) {
      // Visit all dependencies first
      for (const depId of task.dependencies) {
        visit(depId)
      }
      
      visiting.delete(taskId)
      visited.add(taskId)
      result.push(task)
    }
  }

  // Visit all tasks
  for (const task of tasks) {
    if (!visited.has(task.id)) {
      visit(task.id)
    }
  }

  return result
}

/**
 * Get successor tasks for a given task
 */
function getSuccessors(taskId: string, tasks: CPMTask[]): string[] {
  return tasks
    .filter(task => task.dependencies.includes(taskId))
    .map(task => task.id)
}

/**
 * Find the critical path by following critical tasks
 */
function findCriticalPath(criticalTasks: CPMTask[]): string[] {
  if (criticalTasks.length === 0) return []
  
  // Sort critical tasks by early start time
  const sortedCritical = [...criticalTasks].sort((a, b) => (a.earlyStart || 0) - (b.earlyStart || 0))
  
  return sortedCritical.map(task => task.id)
}

/**
 * Create example milestone with tasks for demonstration
 */
export function createExampleMilestone(): { milestone: string, tasks: CPMTask[] } {
  const tasks: CPMTask[] = [
    {
      id: 'A',
      title: 'Setup Infrastructure',
      duration: 3,
      dependencies: []
    },
    {
      id: 'B',
      title: 'Deploy Backend',
      duration: 2,
      dependencies: ['A']
    },
    {
      id: 'C',
      title: 'Deploy Frontend',
      duration: 2,
      dependencies: ['A']
    },
    {
      id: 'D',
      title: 'Integration Testing',
      duration: 3,
      dependencies: ['B', 'C']
    }
  ]

  return {
    milestone: 'Deployment Phase',
    tasks
  }
}