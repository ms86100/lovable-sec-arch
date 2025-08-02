import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Clock, Users, Target, ChevronLeft, ChevronRight, Filter, CheckCircle } from 'lucide-react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns'

interface Project {
  id: string
  name: string
  status: string
  progress: number
  priority: string
  start_date?: string
  end_date?: string
  assigned_to?: string
  products: {
    name: string
  }
}

interface TimelineActivity {
  id: string
  title: string
  description: string
  date: string
  type: 'milestone' | 'task' | 'review' | 'delivery'
  status: 'completed' | 'in_progress' | 'planned'
  assignee?: string
}

interface TimelineProps {
  projects: Project[]
  onProjectClick?: (projectId: string) => void
  selectedProjectId?: string
}

export function ProjectTimeline({ projects, onProjectClick, selectedProjectId }: TimelineProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [projectActivities, setProjectActivities] = useState<TimelineActivity[]>([])

  // Generate sample roadmap activities for selected project
  useEffect(() => {
    if (selectedProjectId && projects.length > 0) {
      const project = projects[0]
      const activities: TimelineActivity[] = [
        {
          id: '1',
          title: 'Project Kickoff',
          description: 'Initial project meeting and requirements gathering',
          date: project.start_date || new Date().toISOString(),
          type: 'milestone',
          status: 'completed',
          assignee: 'Project Manager'
        },
        {
          id: '2',
          title: 'Design Phase',
          description: 'Create system architecture and UI/UX designs',
          date: project.start_date ? new Date(Date.parse(project.start_date) + 7 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
          type: 'task',
          status: project.progress > 25 ? 'completed' : 'in_progress',
          assignee: 'Design Team'
        },
        {
          id: '3',
          title: 'Development Sprint 1',
          description: 'Core functionality implementation',
          date: project.start_date ? new Date(Date.parse(project.start_date) + 14 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
          type: 'task',
          status: project.progress > 50 ? 'completed' : project.progress > 25 ? 'in_progress' : 'planned',
          assignee: 'Development Team'
        },
        {
          id: '4',
          title: 'Mid-Project Review',
          description: 'Stakeholder review and feedback session',
          date: project.start_date ? new Date(Date.parse(project.start_date) + 21 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
          type: 'review',
          status: project.progress > 50 ? 'completed' : 'planned',
          assignee: 'Stakeholders'
        },
        {
          id: '5',
          title: 'Development Sprint 2',
          description: 'Advanced features and integrations',
          date: project.start_date ? new Date(Date.parse(project.start_date) + 28 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
          type: 'task',
          status: project.progress > 75 ? 'completed' : project.progress > 50 ? 'in_progress' : 'planned',
          assignee: 'Development Team'
        },
        {
          id: '6',
          title: 'Final Testing',
          description: 'Quality assurance and user acceptance testing',
          date: project.end_date ? new Date(Date.parse(project.end_date) - 7 * 24 * 60 * 60 * 1000).toISOString() : new Date().toISOString(),
          type: 'task',
          status: project.progress === 100 ? 'completed' : project.progress > 75 ? 'in_progress' : 'planned',
          assignee: 'QA Team'
        },
        {
          id: '7',
          title: 'Project Delivery',
          description: 'Final deliverable handover and project closure',
          date: project.end_date || new Date().toISOString(),
          type: 'delivery',
          status: project.progress === 100 ? 'completed' : 'planned',
          assignee: 'Project Manager'
        }
      ]
      setProjectActivities(activities)
    } else {
      setProjectActivities([])
    }
  }, [selectedProjectId, projects])
  
  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const getProjectPosition = (project: Project) => {
    if (!project.start_date || !project.end_date) return null
    
    const startDate = parseISO(project.start_date)
    const endDate = parseISO(project.end_date)
    
    // Calculate position within the week view
    const dayWidth = 100 / 7 // 7 days in a week
    const startDay = weekDays.findIndex(day => isSameDay(day, startDate))
    const endDay = weekDays.findIndex(day => isSameDay(day, endDate))
    
    if (startDay === -1 && endDay === -1) {
      // Project spans beyond current week view
      if (startDate < weekStart && endDate > weekEnd) {
        return { left: 0, width: 100 }
      }
      return null
    }
    
    const left = Math.max(0, startDay * dayWidth)
    const right = Math.min(100, (endDay + 1) * dayWidth)
    const width = right - left
    
    return { left, width }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success'
      case 'completed': return 'bg-primary'
      case 'on_hold': return 'bg-warning'
      case 'planning': return 'bg-info'
      case 'cancelled': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-destructive'
      case 'medium': return 'border-l-warning'
      case 'low': return 'border-l-success'
      default: return 'border-l-muted'
    }
  }

  return (
    <Card className="airbus-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-airbus-blue" />
              Project Timeline
            </CardTitle>
            <CardDescription>
              Visual overview of project schedules and milestones
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium px-4">
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline Header */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="text-center p-2 text-xs font-medium text-muted-foreground border-b"
            >
              <div>{format(day, 'EEE')}</div>
              <div className="text-lg font-bold mt-1">{format(day, 'dd')}</div>
            </div>
          ))}
        </div>

        {/* Project Bars */}
        <div className="space-y-3">
          {projects
            .filter(project => project.start_date && project.end_date)
            .map((project) => {
              const position = getProjectPosition(project)
              if (!position) return null

              return (
                <div
                  key={project.id}
                  className="relative"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium truncate">{project.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {project.products.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {project.progress}% complete
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Bar */}
                  <div className="relative h-8 bg-muted/30 rounded-md">
                    <div
                      className={`absolute top-0 h-full rounded-md cursor-pointer transition-all duration-200 hover:opacity-80 border-l-4 ${getStatusColor(project.status)} ${getPriorityColor(project.priority)}`}
                      style={{
                        left: `${position.left}%`,
                        width: `${position.width}%`,
                      }}
                      onClick={() => onProjectClick?.(project.id)}
                    >
                      <div className="flex items-center justify-between h-full px-2">
                        <span className="text-xs font-medium text-white truncate">
                          {project.name}
                        </span>
                        <span className="text-xs text-white/80">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {projects.filter(p => p.start_date && p.end_date).length === 0 && !selectedProjectId && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects with defined timelines found</p>
            <p className="text-sm">Add start and end dates to projects to see them here</p>
          </div>
        )}

        {/* Project Roadmap Activities for Selected Project */}
        {selectedProjectId && projectActivities.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-airbus-blue" />
              Project Roadmap & Activities
            </h3>
            <div className="space-y-4">
              {projectActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-success text-success-foreground' :
                      activity.status === 'in_progress' ? 'bg-warning text-warning-foreground' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {activity.type === 'milestone' && <Target className="w-5 h-5" />}
                      {activity.type === 'task' && <Clock className="w-5 h-5" />}
                      {activity.type === 'review' && <Users className="w-5 h-5" />}
                      {activity.type === 'delivery' && <CheckCircle className="w-5 h-5" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(activity.date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          activity.status === 'completed' ? 'default' :
                          activity.status === 'in_progress' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {activity.status.replace('_', ' ')}
                      </Badge>
                      {activity.assignee && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectTimeline