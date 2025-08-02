import React from 'react'
import { CPMTask } from '@/lib/cpm'
import { Badge } from '@/components/ui/badge'

interface CPMGanttChartProps {
  tasks: CPMTask[]
  criticalPath: string[]
  projectDuration: number
}

export function CPMGanttChart({ tasks, criticalPath, projectDuration }: CPMGanttChartProps) {
  // Calculate the timeline scale
  const timeScale = 100 / projectDuration // percentage per time unit
  
  return (
    <div className="w-full border rounded-lg bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold">Critical Path Gantt Chart</h3>
        <p className="text-sm text-muted-foreground">
          Project Duration: {projectDuration} days | Critical Path highlighted in red
        </p>
      </div>
      
      {/* Timeline Header */}
      <div className="border-b bg-gray-50">
        <div className="flex">
          <div className="w-48 p-3 border-r font-medium">Task</div>
          <div className="flex-1 p-3">
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-600">
                {Array.from({ length: Math.ceil(projectDuration) + 1 }, (_, i) => i).map(day => (
                  <span key={day} className="text-center">
                    Day {day}
                  </span>
                ))}
              </div>
              {/* Grid lines */}
              <div className="absolute top-6 left-0 right-0 flex justify-between">
                {Array.from({ length: Math.ceil(projectDuration) + 1 }, (_, i) => i).map(day => (
                  <div key={day} className="w-px bg-gray-200 h-4"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task Rows */}
      <div>
        {tasks.map((task, index) => {
          const isCritical = criticalPath.includes(task.id)
          const leftPosition = (task.earlyStart || 0) * timeScale
          const width = task.duration * timeScale
          
          return (
            <div key={task.id} className={`flex border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              {/* Task Info */}
              <div className="w-48 p-3 border-r">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{task.title}</span>
                  {isCritical && (
                    <Badge className="bg-red-500 text-white text-xs">
                      Critical
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {task.duration} days | Slack: {task.slack || 0} days
                </div>
              </div>
              
              {/* Gantt Bar */}
              <div className="flex-1 p-3 relative">
                <div className="relative h-8">
                  {/* Task Bar */}
                  <div
                    className={`absolute h-6 rounded ${
                      isCritical ? 'bg-red-500' : 'bg-blue-500'
                    } flex items-center justify-center text-white text-xs font-medium`}
                    style={{
                      left: `${leftPosition}%`,
                      width: `${width}%`,
                      minWidth: '2px'
                    }}
                  >
                    {width > 15 && `${task.duration}d`}
                  </div>
                  
                  {/* Slack indicator */}
                  {task.slack && task.slack > 0 && (
                    <div
                      className="absolute h-6 border-2 border-dashed border-gray-400 rounded"
                      style={{
                        left: `${leftPosition}%`,
                        width: `${(task.duration + task.slack) * timeScale}%`,
                        minWidth: '2px'
                      }}
                    />
                  )}
                  
                  {/* Dependencies lines */}
                  {task.dependencies.map(depId => {
                    const depTask = tasks.find(t => t.id === depId)
                    if (!depTask) return null
                    
                    const depEndPosition = ((depTask.earlyFinish || 0) * timeScale)
                    const taskStartPosition = leftPosition
                    
                    return (
                      <div
                        key={depId}
                        className="absolute top-6 border-t-2 border-gray-400"
                        style={{
                          left: `${depEndPosition}%`,
                          width: `${taskStartPosition - depEndPosition}%`
                        }}
                      />
                    )
                  })}
                </div>
                
                {/* Task Details Tooltip Area */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black text-white text-xs p-2 rounded shadow-lg absolute top-10 left-2 z-10 whitespace-nowrap">
                    <div>Start: Day {task.earlyStart} | End: Day {task.earlyFinish}</div>
                    <div>Latest Start: Day {task.lateStart} | Latest End: Day {task.lateFinish}</div>
                    <div>Slack: {task.slack} days</div>
                    {task.dependencies.length > 0 && (
                      <div>Dependencies: {task.dependencies.map(depId => {
                        const depTask = tasks.find(t => t.id === depId)
                        return depTask ? depTask.title : depId
                      }).join(', ')}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Critical Path Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Non-Critical Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-gray-400 rounded"></div>
            <span>Total Float/Slack</span>
          </div>
        </div>
      </div>
    </div>
  )
}