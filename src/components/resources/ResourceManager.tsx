import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, User, Calendar, Clock, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  capacity: number // percentage
  currentWorkload: number // percentage
  projects: Array<{
    id: string
    name: string
    allocation: number
  }>
}

interface ResourceAllocation {
  projectId: string
  projectName: string
  teamMembers: Array<{
    memberId: string
    memberName: string
    role: string
    allocation: number
    startDate: string
    endDate: string
  }>
}

export function ResourceManager() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [allocations, setAllocations] = useState<ResourceAllocation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'team' | 'projects' | 'calendar'>('team')

  useEffect(() => {
    fetchResourceData()
  }, [])

  const fetchResourceData = async () => {
    try {
      // Fetch team data from stakeholders and projects
      const { data: stakeholders } = await supabase
        .from('project_stakeholders')
        .select(`
          *,
          projects!inner (id, name)
        `)
        .eq('is_internal', true)

      // Fetch projects for allocation view
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, status')
        .in('status', ['active', 'planning'])

      // Generate mock team member data (in real app, this would come from HR system)
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@company.com',
          role: 'Senior Developer',
          department: 'Engineering',
          capacity: 100,
          currentWorkload: 85,
          projects: [
            { id: 'proj1', name: 'Alpha Project', allocation: 50 },
            { id: 'proj2', name: 'Beta Release', allocation: 35 }
          ]
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@company.com',
          role: 'Project Manager',
          department: 'PMO',
          capacity: 100,
          currentWorkload: 75,
          projects: [
            { id: 'proj1', name: 'Alpha Project', allocation: 25 },
            { id: 'proj3', name: 'Gamma Initiative', allocation: 50 }
          ]
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@company.com',
          role: 'UX Designer',
          department: 'Design',
          capacity: 100,
          currentWorkload: 60,
          projects: [
            { id: 'proj2', name: 'Beta Release', allocation: 40 },
            { id: 'proj4', name: 'Delta Platform', allocation: 20 }
          ]
        },
        {
          id: '4',
          name: 'David Kim',
          email: 'david.kim@company.com',
          role: 'DevOps Engineer',
          department: 'Infrastructure',
          capacity: 100,
          currentWorkload: 95,
          projects: [
            { id: 'proj1', name: 'Alpha Project', allocation: 30 },
            { id: 'proj2', name: 'Beta Release', allocation: 35 },
            { id: 'proj3', name: 'Gamma Initiative', allocation: 30 }
          ]
        },
        {
          id: '5',
          name: 'Lisa Wang',
          email: 'lisa.wang@company.com',
          role: 'Business Analyst',
          department: 'Strategy',
          capacity: 100,
          currentWorkload: 70,
          projects: [
            { id: 'proj3', name: 'Gamma Initiative', allocation: 40 },
            { id: 'proj4', name: 'Delta Platform', allocation: 30 }
          ]
        }
      ]

      setTeamMembers(mockTeamMembers)

    } catch (error) {
      console.error('Error fetching resource data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWorkloadColor = (workload: number) => {
    if (workload >= 95) return 'text-destructive'
    if (workload >= 80) return 'text-warning'
    if (workload >= 60) return 'text-success'
    return 'text-info'
  }

  const getWorkloadBadge = (workload: number) => {
    if (workload >= 95) return 'destructive'
    if (workload >= 80) return 'outline'
    return 'secondary'
  }

  const getCapacityStatus = (workload: number) => {
    if (workload >= 95) return 'Overallocated'
    if (workload >= 80) return 'High Utilization'
    if (workload >= 60) return 'Optimal'
    return 'Available'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="airbus-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const overallocatedMembers = teamMembers.filter(m => m.currentWorkload >= 95).length
  const highUtilizationMembers = teamMembers.filter(m => m.currentWorkload >= 80 && m.currentWorkload < 95).length
  const availableMembers = teamMembers.filter(m => m.currentWorkload < 80).length
  const avgUtilization = Math.round(teamMembers.reduce((sum, m) => sum + m.currentWorkload, 0) / teamMembers.length)

  return (
    <div className="space-y-6">
      {/* Resource Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold text-airbus-blue">{teamMembers.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active resources</p>
              </div>
              <Users className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Utilization</p>
                <p className={`text-3xl font-bold ${getWorkloadColor(avgUtilization)}`}>{avgUtilization}%</p>
                <p className="text-xs text-muted-foreground mt-1">Team capacity</p>
              </div>
              <TrendingUp className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available</p>
                <p className="text-3xl font-bold text-success">{availableMembers}</p>
                <p className="text-xs text-muted-foreground mt-1">Under 80% capacity</p>
              </div>
              <Zap className="h-8 w-8 text-success group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overallocated</p>
                <p className="text-3xl font-bold text-destructive">{overallocatedMembers}</p>
                <p className="text-xs text-muted-foreground mt-1">Above 95% capacity</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-airbus-blue">Resource Allocation</h3>
          <p className="text-muted-foreground">Monitor team capacity and project assignments</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">Team View</SelectItem>
              <SelectItem value="projects">Project View</SelectItem>
              <SelectItem value="calendar">Calendar View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Team Members View */}
      {viewMode === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="airbus-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-airbus-blue/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-airbus-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.role} • {member.department}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={getWorkloadBadge(member.currentWorkload)}>
                    {getCapacityStatus(member.currentWorkload)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Workload Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Current Workload</span>
                    <span className={`font-medium ${getWorkloadColor(member.currentWorkload)}`}>
                      {member.currentWorkload}%
                    </span>
                  </div>
                  <Progress 
                    value={member.currentWorkload} 
                    className="h-3"
                  />
                </div>

                {/* Project Assignments */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Project Assignments</h4>
                  <div className="space-y-2">
                    {member.projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm font-medium">{project.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {project.allocation}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Available Capacity</span>
                    <span className="font-medium">
                      {Math.max(0, member.capacity - member.currentWorkload)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Workload Heatmap */}
      {viewMode === 'calendar' && (
        <Card className="airbus-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-airbus-blue" />
              Resource Availability Heatmap
            </CardTitle>
            <CardDescription>
              Visual overview of team capacity across time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Calendar View Coming Soon</h3>
              <p className="text-sm">
                This feature will show team availability across weeks and months
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project View */}
      {viewMode === 'projects' && (
        <Card className="airbus-card">
          <CardHeader>
            <CardTitle>Project Resource Allocation</CardTitle>
            <CardDescription>
              Resource assignments by project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Project View Coming Soon</h3>
              <p className="text-sm">
                This feature will show resource allocation from the project perspective
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ResourceManager