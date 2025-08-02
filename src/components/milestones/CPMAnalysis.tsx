import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Clock, TrendingUp, Network, BarChart3, RefreshCw } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"
import { calculateCPM, createExampleMilestone, CPMTask, CPMResult } from '@/lib/cpm'
import { CPMDiagram } from './CPMDiagram'
import { CPMGanttChart } from './CPMGanttChart'

interface Task {
  id: string
  title: string
  estimated_effort_hours: number
  dependencies: any // JSON type from database
  milestone_id: string
}

interface CPMAnalysisProps {
  projectId?: string
  projectName?: string
  milestoneId?: string
}

export function CPMAnalysis({ projectId, projectName, milestoneId }: CPMAnalysisProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showExample, setShowExample] = useState(false)
  
  const fetchTasks = async () => {
    if (!projectId && !milestoneId) return
    
    try {
      setLoading(true)
      
      let query = supabase
        .from('project_tasks')
        .select('id, title, estimated_effort_hours, dependencies, milestone_id')
        .order('title')
      
      if (milestoneId) {
        query = query.eq('milestone_id', milestoneId)
      } else if (projectId) {
        // Get all tasks for the project via milestones
        const { data: milestones } = await supabase
          .from('project_milestones')
          .select('id')
          .eq('project_id', projectId)
        
        if (milestones && milestones.length > 0) {
          const milestoneIds = milestones.map(m => m.id)
          query = query.in('milestone_id', milestoneIds)
        }
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tasks for CPM analysis."
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId, milestoneId])

  // Convert database tasks to CPM format
  const cpmTasks: CPMTask[] = useMemo(() => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      duration: task.estimated_effort_hours || 8, // Default 8 hours if not set
      dependencies: Array.isArray(task.dependencies) ? task.dependencies : []
    }))
  }, [tasks])

  // Calculate CPM
  const cmpResult: CPMResult | null = useMemo(() => {
    if (cpmTasks.length === 0) return null
    
    try {
      return calculateCPM(cpmTasks)
    } catch (error) {
      console.error('CPM calculation error:', error)
      toast({
        variant: "destructive",
        title: "CPM Calculation Error",
        description: error instanceof Error ? error.message : "Failed to calculate critical path"
      })
      return null
    }
  }, [cpmTasks])

  // Example data
  const exampleData = useMemo(() => {
    const { milestone, tasks: exampleTasks } = createExampleMilestone()
    const result = calculateCPM(exampleTasks)
    return { milestone, result }
  }, [])

  const currentData = showExample ? exampleData.result : cmpResult
  const currentTasks = showExample ? exampleData.result.tasks : (cmpResult?.tasks || [])

  if (!projectId && !milestoneId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Critical Path Method (CPM) Analysis
          </CardTitle>
          <CardDescription>
            Select a project or milestone to analyze the critical path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={() => setShowExample(!showExample)} variant="outline">
              {showExample ? 'Hide Example' : 'Show Example'}
            </Button>
            
            {showExample && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Example: {exampleData.milestone}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Project Duration</div>
                      <div className="text-2xl font-bold text-blue-600">{exampleData.result.projectDuration} days</div>
                    </div>
                    <div>
                      <div className="font-medium">Total Tasks</div>
                      <div className="text-2xl font-bold">{exampleData.result.tasks.length}</div>
                    </div>
                    <div>
                      <div className="font-medium">Critical Tasks</div>
                      <div className="text-2xl font-bold text-red-600">{exampleData.result.criticalTasks.length}</div>
                    </div>
                    <div>
                      <div className="font-medium">Critical Path</div>
                      <div className="text-sm">{exampleData.result.criticalPath.join(' → ')}</div>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="gantt" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="gantt" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Gantt Chart
                    </TabsTrigger>
                    <TabsTrigger value="network" className="flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Network Diagram
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Task Details
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gantt" className="space-y-4">
                    <CPMGanttChart 
                      tasks={exampleData.result.tasks}
                      criticalPath={exampleData.result.criticalPath}
                      projectDuration={exampleData.result.projectDuration}
                    />
                  </TabsContent>
                  
                  <TabsContent value="network" className="space-y-4">
                    <CPMDiagram 
                      tasks={exampleData.result.tasks}
                      criticalPath={exampleData.result.criticalPath}
                    />
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid gap-4">
                      {exampleData.result.tasks.map(task => (
                        <Card key={task.id} className={task.isCritical ? 'border-red-200 bg-red-50' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{task.title}</h4>
                              {task.isCritical && (
                                <Badge className="bg-red-500 text-white">Critical</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                              <div>
                                <div className="text-muted-foreground">Duration</div>
                                <div className="font-medium">{task.duration} days</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Early Start</div>
                                <div className="font-medium">{task.earlyStart}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Early Finish</div>
                                <div className="font-medium">{task.earlyFinish}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Late Start</div>
                                <div className="font-medium">{task.lateStart}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Late Finish</div>
                                <div className="font-medium">{task.lateFinish}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Slack</div>
                                <div className={`font-medium ${task.slack === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {task.slack} days
                                </div>
                              </div>
                            </div>
                            {task.dependencies.length > 0 && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Dependencies: </span>
                                <span className="font-medium">{task.dependencies.join(', ')}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Critical Path Method (CPM) Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Critical Path Method (CPM) Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm text-muted-foreground mb-4">Add tasks with estimated effort and dependencies to perform CPM analysis</p>
            <Button onClick={() => setShowExample(true)} variant="outline">
              View Example
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Critical Path Method (CPM) Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium">CPM Calculation Failed</p>
            <p className="text-sm text-muted-foreground mb-4">Please check task dependencies for circular references</p>
            <Button onClick={fetchTasks} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Critical Path Method Analysis
              {projectName && <span className="text-sm font-normal text-muted-foreground">for: {projectName}</span>}
            </CardTitle>
            <CardDescription>
              Analyze project timeline and identify critical tasks
            </CardDescription>
          </div>
          <Button onClick={fetchTasks} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Project Duration</div>
              <div className="text-2xl font-bold text-blue-600">{currentData.projectDuration} hours</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Tasks</div>
              <div className="text-2xl font-bold">{currentData.tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Critical Tasks</div>
              <div className="text-2xl font-bold text-red-600">{currentData.criticalTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Critical Path</div>
              <div className="text-sm font-medium">
                {currentData.criticalPath.length > 0 ? 
                  currentTasks
                    .filter(t => currentData.criticalPath.includes(t.id))
                    .map(t => t.title.substring(0, 10) + (t.title.length > 10 ? '...' : ''))
                    .join(' → ') 
                  : 'None'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Tabs */}
        <Tabs defaultValue="gantt" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gantt" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gantt Chart
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network Diagram
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Task Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gantt" className="space-y-4">
            <CPMGanttChart 
              tasks={currentData.tasks}
              criticalPath={currentData.criticalPath}
              projectDuration={currentData.projectDuration}
            />
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <CPMDiagram 
              tasks={currentData.tasks}
              criticalPath={currentData.criticalPath}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              {currentData.tasks.map(task => (
                <Card key={task.id} className={task.isCritical ? 'border-red-200 bg-red-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{task.title}</h4>
                      {task.isCritical && (
                        <Badge className="bg-red-500 text-white">Critical</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Duration</div>
                        <div className="font-medium">{task.duration}h</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Early Start</div>
                        <div className="font-medium">{task.earlyStart}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Early Finish</div>
                        <div className="font-medium">{task.earlyFinish}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Late Start</div>
                        <div className="font-medium">{task.lateStart}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Late Finish</div>
                        <div className="font-medium">{task.lateFinish}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Slack</div>
                        <div className={`font-medium ${task.slack === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {task.slack}h
                        </div>
                      </div>
                    </div>
                    {task.dependencies.length > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Dependencies: </span>
                        <span className="font-medium">
                          {task.dependencies.map(depId => {
                            const depTask = currentTasks.find(t => t.id === depId)
                            return depTask ? depTask.title : depId
                          }).join(', ')}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}