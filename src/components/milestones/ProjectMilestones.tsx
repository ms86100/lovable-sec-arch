import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

interface Milestone {
  id: string
  title: string
  description: string | null
  due_date: string | null
  status: string
  progress: number
  tasks?: Task[]
}

interface Task {
  id: string
  title: string
  description: string | null
  owner_id: string | null
  owner_type: string
  owner_name?: string
  due_date: string | null
  status: string
  priority: string
}

interface ProjectMilestonesProps {
  projectId: string | null
}

export function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectId) {
      fetchMilestones()
    } else {
      setMilestones([])
      setLoading(false)
    }
  }, [projectId])

  const fetchMilestones = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      
      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true })

      if (milestonesError) throw milestonesError

      // Fetch tasks for each milestone
      const milestonesWithTasks = await Promise.all(
        (milestonesData || []).map(async (milestone) => {
          const { data: tasksData, error: tasksError } = await supabase
            .from('project_tasks')
            .select('*')
            .eq('milestone_id', milestone.id)
            .order('due_date', { ascending: true })

          if (tasksError) {
            console.error('Error fetching tasks:', tasksError)
            return { ...milestone, tasks: [] }
          }

          // Fetch owner names separately based on owner_type and owner_id
          const tasksWithOwners = await Promise.all(
            (tasksData || []).map(async (task) => {
              let owner_name = null
              
              if (task.owner_id && task.owner_type) {
                if (task.owner_type === 'stakeholder') {
                  const { data: stakeholder } = await supabase
                    .from('project_stakeholders')
                    .select('name')
                    .eq('id', task.owner_id)
                    .single()
                  owner_name = stakeholder?.name
                } else if (task.owner_type === 'team_member') {
                  const { data: teamMember } = await supabase
                    .from('project_team_members')
                    .select('name')
                    .eq('id', task.owner_id)
                    .single()
                  owner_name = teamMember?.name
                }
              }
              
              return { ...task, owner_name }
            })
          )

          return { ...milestone, tasks: tasksWithOwners }
        })
      )

      setMilestones(milestonesWithTasks)
    } catch (error) {
      console.error('Error fetching milestones:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load project milestones."
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Milestones
          </CardTitle>
          <CardDescription>
            Select a project to view its milestones and tasks
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
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
              <Calendar className="h-5 w-5" />
              Project Milestones
            </CardTitle>
            <CardDescription>
              Track project milestones and their associated tasks
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No milestones found</p>
            <p className="text-sm">Create your first milestone to get started</p>
          </div>
        ) : (
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(milestone.status)}
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.due_date && (
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(milestone.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1">
                      {milestone.progress}% Complete
                    </div>
                    <Progress value={milestone.progress} className="w-24" />
                  </div>
                </div>

                {milestone.tasks && milestone.tasks.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">Tasks</h4>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Task
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {milestone.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="text-sm">{task.title}</span>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {task.owner_name && (
                              <span>{task.owner_name}</span>
                            )}
                            {task.due_date && (
                              <span>{new Date(task.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}