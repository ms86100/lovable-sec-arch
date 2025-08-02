import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarIcon, Plus, Target, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Milestone {
  id: string
  title: string
  description?: string
  status: string
  progress: number
  due_date?: string
  created_at: string
}

interface Task {
  id: string
  milestone_id: string
  title: string
  description?: string
  status: string
  priority: string
  owner_id?: string
  owner_type: string
  due_date?: string
  created_at: string
  progress: number
  points: number
  dependencies: string[]
}

interface Stakeholder {
  id: string
  name: string
  email?: string
}

interface TeamMember {
  user_id: string
  name: string
  email?: string
}

interface ProjectTimelineProps {
  projectId: string
  projectName: string
  readOnly?: boolean
}

export function ProjectTimeline({ projectId, projectName, readOnly = false }: ProjectTimelineProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedMilestone, setSelectedMilestone] = useState<string>('')

  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    progress: 0,
    due_date: undefined as Date | undefined
  })

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    owner_id: '',
    owner_type: 'stakeholder',
    due_date: undefined as Date | undefined,
    progress: 0,
    points: 1,
    dependencies: [] as string[]
  })

  useEffect(() => {
    fetchData()
  }, [projectId])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true })

      if (milestonesError) throw milestonesError

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .in('milestone_id', milestonesData?.map(m => m.id) || [])
        .order('due_date', { ascending: true })

      if (tasksError) throw tasksError

      // Fetch stakeholders
      const { data: stakeholdersData, error: stakeholdersError } = await supabase
        .from('project_stakeholders')
        .select('id, name, email')
        .eq('project_id', projectId)

      if (stakeholdersError) throw stakeholdersError

      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('project_team_members')
        .select('id, name, email')
        .eq('project_id', projectId)

      if (teamError) throw teamError

      setMilestones(milestonesData || [])
      setTasks((tasksData || []).map(task => ({
        ...task,
        dependencies: Array.isArray(task.dependencies) ? task.dependencies.map(dep => String(dep)) : []
      })))
      setStakeholders(stakeholdersData || [])
      setTeamMembers(teamData?.map(member => ({
        user_id: member.id,
        name: member.name,
        email: member.email
      })) || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetMilestoneForm = () => {
    setMilestoneForm({
      title: '',
      description: '',
      status: 'pending',
      progress: 0,
      due_date: undefined
    })
    setEditingMilestone(null)
  }

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      owner_id: '',
      owner_type: 'stakeholder',
      due_date: undefined,
      progress: 0,
      points: 1,
      dependencies: []
    })
    setEditingTask(null)
    setSelectedMilestone('')
  }

  const handleMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const milestoneData = {
        project_id: projectId,
        title: milestoneForm.title,
        description: milestoneForm.description || null,
        status: milestoneForm.status,
        progress: milestoneForm.progress,
        due_date: milestoneForm.due_date ? format(milestoneForm.due_date, 'yyyy-MM-dd') : null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingMilestone) {
        const { error } = await supabase
          .from('project_milestones')
          .update(milestoneData)
          .eq('id', editingMilestone.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Milestone updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_milestones')
          .insert(milestoneData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Milestone created successfully"
        })
      }

      setMilestoneDialogOpen(false)
      resetMilestoneForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate task due date against milestone due date
    if (taskForm.due_date && selectedMilestone) {
      const milestone = milestones.find(m => m.id === selectedMilestone)
      if (milestone && milestone.due_date) {
        const taskDueDate = taskForm.due_date
        const milestoneDueDate = new Date(milestone.due_date)
        if (taskDueDate > milestoneDueDate) {
          toast({
            title: "Validation Error",
            description: "Task due date cannot be later than the milestone date.",
            variant: "destructive"
          })
          return
        }
      }
    }
    
    try {
      const taskData = {
        milestone_id: selectedMilestone,
        title: taskForm.title,
        description: taskForm.description || null,
        status: taskForm.status,
        priority: taskForm.priority,
        owner_id: taskForm.owner_id || null,
        owner_type: taskForm.owner_type,
        due_date: taskForm.due_date ? format(taskForm.due_date, 'yyyy-MM-dd') : null,
        progress: taskForm.progress,
        points: taskForm.points,
        dependencies: taskForm.dependencies,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingTask) {
        const { error } = await supabase
          .from('project_tasks')
          .update(taskData)
          .eq('id', editingTask.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Task updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_tasks')
          .insert(taskData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Task created successfully"
        })
      }

      setTaskDialogOpen(false)
      resetTaskForm()
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const openEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description || '',
      status: milestone.status,
      progress: milestone.progress,
      due_date: milestone.due_date ? new Date(milestone.due_date) : undefined
    })
    setMilestoneDialogOpen(true)
  }

  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setSelectedMilestone(task.milestone_id)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      owner_id: task.owner_id || '',
      owner_type: task.owner_type,
      due_date: task.due_date ? new Date(task.due_date) : undefined,
      progress: task.progress || 0,
      points: task.points || 1,
      dependencies: task.dependencies || []
    })
    setTaskDialogOpen(true)
  }

  const deleteMilestone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this milestone? All associated tasks will also be deleted.')) return

    try {
      const { error } = await supabase
        .from('project_milestones')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Milestone deleted successfully"
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Task deleted successfully"
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getOwnerName = (ownerId: string, ownerType: string) => {
    if (ownerType === 'stakeholder') {
      const stakeholder = stakeholders.find(s => s.id === ownerId)
      return stakeholder?.name || 'Unknown'
    } else {
      const member = teamMembers.find(m => m.user_id === ownerId)
      return member?.name || 'Unknown'
    }
  }

  if (loading) {
    return <div className="p-6">Loading timeline...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Timeline & Milestones</h2>
          <p className="text-muted-foreground">Manage milestones and tasks for {projectName}</p>
        </div>
        
        {!readOnly && (
          <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetMilestoneForm(); setMilestoneDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
                </DialogTitle>
                <DialogDescription>
                  Create milestones to track project progress and organize tasks
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone_title">Title *</Label>
                    <Input
                      id="milestone_title"
                      value={milestoneForm.title}
                      onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestone_status">Status</Label>
                    <Select value={milestoneForm.status} onValueChange={(value) => setMilestoneForm({...milestoneForm, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone_progress">Progress (%)</Label>
                    <Input
                      id="milestone_progress"
                      type="number"
                      min="0"
                      max="100"
                      value={milestoneForm.progress}
                      onChange={(e) => setMilestoneForm({...milestoneForm, progress: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !milestoneForm.due_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {milestoneForm.due_date ? format(milestoneForm.due_date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={milestoneForm.due_date}
                          onSelect={(date) => setMilestoneForm({...milestoneForm, due_date: date})}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="milestone_description">Description</Label>
                  <Textarea
                    id="milestone_description"
                    value={milestoneForm.description}
                    onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                    placeholder="Describe this milestone..."
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setMilestoneDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMilestone ? 'Update' : 'Create'} Milestone
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-6">
        {milestones.length > 0 ? (
          milestones.map((milestone) => {
            const milestoneTasks = tasks.filter(task => task.milestone_id === milestone.id)
            
            return (
              <Card key={milestone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {milestone.title}
                          <Badge variant={getStatusColor(milestone.status)}>
                            {milestone.status.replace('_', ' ')}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {milestone.description}
                          {milestone.due_date && (
                            <span className="ml-2">• Due: {format(new Date(milestone.due_date), 'MMM dd, yyyy')}</span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    
                    {!readOnly && (
                      <div className="flex items-center gap-2">
                        <Dialog open={taskDialogOpen && selectedMilestone === milestone.id} onOpenChange={(open) => {
                          setTaskDialogOpen(open)
                          if (open) setSelectedMilestone(milestone.id)
                          else resetTaskForm()
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="mr-1 h-3 w-3" />
                              Add Task
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                {editingTask ? 'Edit Task' : 'Add New Task'}
                              </DialogTitle>
                              <DialogDescription>
                                Add a task to the "{milestone.title}" milestone
                              </DialogDescription>
                            </DialogHeader>
                            
                            <form onSubmit={handleTaskSubmit} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="task_title">Title *</Label>
                                  <Input
                                    id="task_title"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="task_priority">Priority</Label>
                                  <Select value={taskForm.priority} onValueChange={(value) => setTaskForm({...taskForm, priority: value})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="task_status">Status</Label>
                                  <Select value={taskForm.status} onValueChange={(value) => setTaskForm({...taskForm, status: value})}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="owner_type">Owner Type</Label>
                                  <Select value={taskForm.owner_type} onValueChange={(value) => {
                                    setTaskForm({...taskForm, owner_type: value, owner_id: ''})
                                  }}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="stakeholder">Stakeholder</SelectItem>
                                      <SelectItem value="team_member">Team Member</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="task_owner">Owner</Label>
                                  <Select value={taskForm.owner_id} onValueChange={(value) => setTaskForm({...taskForm, owner_id: value})}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select owner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {taskForm.owner_type === 'stakeholder' 
                                        ? stakeholders.map((stakeholder) => (
                                            <SelectItem key={stakeholder.id} value={stakeholder.id}>
                                              {stakeholder.name}
                                            </SelectItem>
                                          ))
                                        : teamMembers.map((member) => (
                                            <SelectItem key={member.user_id} value={member.user_id}>
                                              {member.name}
                                            </SelectItem>
                                          ))
                                      }
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="task_progress">Progress (%)</Label>
                                  <Input
                                    id="task_progress"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={taskForm.progress}
                                    onChange={(e) => setTaskForm({...taskForm, progress: parseInt(e.target.value) || 0})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="task_points">Points (1 point = 1 day)</Label>
                                  <Input
                                    id="task_points"
                                    type="number"
                                    min="1"
                                    value={taskForm.points}
                                    onChange={(e) => setTaskForm({...taskForm, points: parseInt(e.target.value) || 1})}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="task_dependencies">Dependencies</Label>
                                <Select value="" onValueChange={(value) => {
                                  if (value && !taskForm.dependencies.includes(value)) {
                                    setTaskForm({...taskForm, dependencies: [...taskForm.dependencies, value]})
                                  }
                                }}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select task dependencies" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {tasks
                                      .filter(t => t.id !== editingTask?.id && 
                                        tasks.some(task => task.milestone_id === selectedMilestone && 
                                          tasks.some(projectTask => projectTask.milestone_id === t.milestone_id)))
                                      .map((task) => (
                                        <SelectItem key={task.id} value={task.id}>
                                          {task.title}
                                        </SelectItem>
                                      ))
                                    }
                                  </SelectContent>
                                </Select>
                                {taskForm.dependencies.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {taskForm.dependencies.map((depId) => {
                                      const depTask = tasks.find(t => t.id === depId)
                                      return depTask ? (
                                        <Badge key={depId} variant="secondary" className="flex items-center gap-1">
                                          {depTask.title}
                                          <button
                                            type="button"
                                            className="ml-1 text-xs"
                                            onClick={() => setTaskForm({
                                              ...taskForm, 
                                              dependencies: taskForm.dependencies.filter(id => id !== depId)
                                            })}
                                          >
                                            ×
                                          </button>
                                        </Badge>
                                      ) : null
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !taskForm.due_date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {taskForm.due_date ? format(taskForm.due_date, 'PPP') : 'Pick a date'}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={taskForm.due_date}
                                      onSelect={(date) => setTaskForm({...taskForm, due_date: date})}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="task_description">Description</Label>
                                <Textarea
                                  id="task_description"
                                  value={taskForm.description}
                                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                                  placeholder="Describe this task..."
                                />
                              </div>

                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {editingTask ? 'Update' : 'Create'} Task
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => openEditMilestone(milestone)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMilestone(milestone.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {milestoneTasks.length > 0 ? (
                      milestoneTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              task.status === 'completed' ? 'bg-green-500' :
                              task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{task.title}</span>
                                <Badge variant={getStatusColor(task.status)} className="text-xs">
                                  {task.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {task.owner_id && (
                                  <span>Owner: {getOwnerName(task.owner_id, task.owner_type)}</span>
                                )}
                                 {task.due_date && (
                                   <span>Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
                                 )}
                                 <span>Progress: {task.progress || 0}%</span>
                                 <span>Points: {task.points || 1}</span>
                               </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              )}
                            </div>
                          </div>
                          
                          {!readOnly && (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => openEditTask(task)}>
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No tasks added to this milestone</p>
                        {!readOnly && <p className="text-sm">Click "Add Task" to get started</p>}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No milestones created</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating milestones to organize your project timeline
              </p>
              {!readOnly && (
                <Button onClick={() => { resetMilestoneForm(); setMilestoneDialogOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Milestone
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}