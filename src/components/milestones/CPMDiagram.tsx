import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  MarkerType
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { CPMTask } from '@/lib/cpm'
import { Badge } from '@/components/ui/badge'
import { Network } from 'lucide-react'

interface CPMDiagramProps {
  tasks: CPMTask[]
  criticalPath: string[]
}

// Custom node component for CPM tasks
const CPMTaskNode = ({ data }: { data: any }) => {
  const task: CPMTask = data.task
  const isCritical = data.isCritical

  return (
    <div 
      className={`px-4 py-3 rounded-lg border-2 bg-white min-w-[200px] ${
        isCritical ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    >
      <div className="text-sm font-semibold mb-2">{task.title}</div>
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-medium">{task.duration} days</span>
        </div>
        <div className="flex justify-between">
          <span>Start:</span>
          <span className="font-medium">Day {task.earlyStart || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>End:</span>
          <span className="font-medium">Day {task.earlyFinish || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Latest Start:</span>
          <span className="font-medium">Day {task.lateStart || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Latest End:</span>
          <span className="font-medium">Day {task.lateFinish || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Slack:</span>
          <span className={`font-medium ${task.slack === 0 ? 'text-red-600' : 'text-green-600'}`}>
            {task.slack || 0} days
          </span>
        </div>
      </div>
      {isCritical && (
        <Badge className="mt-2 bg-red-500 text-white text-xs">
          Critical
        </Badge>
      )}
    </div>
  )
}

const nodeTypes = {
  cpmTask: CPMTaskNode
}

export function CPMDiagram({ tasks, criticalPath }: CPMDiagramProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []

    // Create nodes
    tasks.forEach((task, index) => {
      const isCritical = criticalPath.includes(task.id)
      
      nodes.push({
        id: task.id,
        type: 'cpmTask',
        data: { 
          task, 
          isCritical,
          label: task.title 
        },
        position: { 
          x: (task.earlyStart || 0) * 150, 
          y: index * 120 
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
      })
    })

    // Create edges based on dependencies
    tasks.forEach(task => {
      task.dependencies.forEach(depId => {
        const isCriticalEdge = criticalPath.includes(task.id) && criticalPath.includes(depId)
        
        edges.push({
          id: `${depId}-${task.id}`,
          source: depId,
          target: task.id,
          type: 'smoothstep',
          style: {
            stroke: isCriticalEdge ? '#ef4444' : '#6b7280',
            strokeWidth: isCriticalEdge ? 3 : 1
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isCriticalEdge ? '#ef4444' : '#6b7280'
          }
        })
      })
    })

    return { nodes, edges }
  }, [tasks, criticalPath])

  if (tasks.length === 0) {
    return (
      <div className="w-full h-[600px] border rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No tasks available for network diagram</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[600px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}