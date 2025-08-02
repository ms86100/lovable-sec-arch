import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  FolderOpen, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Target,
  FileText,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'

interface DashboardStats {
  totalProducts: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  planningProjects: number
  onHoldProjects: number
  projectsThisWeek: number
  templatesUsed: number
  avgProgress: number
}

interface Project {
  id: string
  name: string
  status: string
  progress: number
  priority: string
  created_at: string
  start_date?: string
  end_date?: string
  assigned_to?: string
  products: {
    name: string
  }
}

interface RecentActivity {
  id: string
  type: 'project_created' | 'project_updated' | 'project_completed'
  project_name: string
  user_name?: string
  timestamp: string
  description: string
}

export default function Dashboard() {
  const { user, userRole, hasRole } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    planningProjects: 0,
    onHoldProjects: 0,
    projectsThisWeek: 0,
    templatesUsed: 0,
    avgProgress: 0
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const canCreateProducts = hasRole('manager') || hasRole('admin')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch all projects data with more details
      const { data: projects, count: projectsCount } = await supabase
        .from('projects')
        .select(`
          *,
          products!inner (name)
        `, { count: 'exact' })

      // Calculate stats
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
      const planningProjects = projects?.filter(p => p.status === 'planning').length || 0
      const onHoldProjects = projects?.filter(p => p.status === 'on_hold').length || 0
      
      // Projects created this week
      const weekStart = startOfWeek(new Date())
      const projectsThisWeek = projects?.filter(p => 
        new Date(p.created_at) >= weekStart
      ).length || 0

      // Average progress
      const avgProgress = projects?.length ? 
        Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0

      // Count templates usage
      const { count: templatesUsed } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .not('template_id', 'is', null)

      setStats({
        totalProducts: productsCount || 0,
        totalProjects: projectsCount || 0,
        activeProjects,
        completedProjects,
        planningProjects,
        onHoldProjects,
        projectsThisWeek,
        templatesUsed: templatesUsed || 0,
        avgProgress
      })

      // Get recent projects with more details
      const { data: recentProjectsData } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          progress,
          priority,
          created_at,
          start_date,
          end_date,
          assigned_to,
          products!inner (name)
        `)
        .order('created_at', { ascending: false })
        .limit(8)

      setRecentProjects(recentProjectsData || [])

      // Generate recent activity (simulated for now - in real app this would come from an activity log table)
      const activities: RecentActivity[] = recentProjectsData?.slice(0, 5).map(project => ({
        id: project.id,
        type: 'project_created',
        project_name: project.name,
        user_name: 'System User',
        timestamp: project.created_at,
        description: `New project "${project.name}" was created`
      })) || []

      setRecentActivity(activities)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'outline'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  // Filter projects based on selected filters
  const filteredProjects = recentProjects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority
    const matchesSearch = searchTerm === '' || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.products.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'on_hold': return 'bg-yellow-500'
      case 'planning': return 'bg-purple-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.email}! You have {userRole?.role} access.
          </p>
        </div>
        <div className="flex gap-3">
          {canCreateProducts && (
            <Button onClick={() => navigate('/products')}>
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active portfolio</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projectsThisWeek}</div>
            <p className="text-xs text-muted-foreground">New projects</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Templates</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templatesUsed}</div>
            <p className="text-xs text-muted-foreground">Using templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Planning</p>
                <p className="text-2xl font-bold">{stats.planningProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">On Hold</p>
                <p className="text-2xl font-bold">{stats.onHoldProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Recent Projects - Enhanced */}
        <div className="xl:col-span-3">
          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Manage and track your projects</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-full sm:w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <div key={project.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                       onClick={() => navigate(`/projects/${project.id}`)}>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium truncate">{project.name}</h4>
                          <Badge variant={getStatusVariant(project.status)}>
                            {project.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getPriorityVariant(project.priority)} className={getPriorityColor(project.priority)}>
                            {project.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            {project.products.name}
                          </div>
                          {project.assigned_to && (
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              Assigned
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(project.created_at), 'MMM dd, yyyy')}
                          </div>
                          {project.start_date && (
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Due: {format(new Date(project.start_date), 'MMM dd')}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Progress value={project.progress} className="flex-1" />
                          <span className="text-sm font-medium w-12">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' 
                      ? 'No projects match your filters' 
                      : 'No projects yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first product to start managing projects'}
                  </p>
                  {canCreateProducts && !searchTerm && filterStatus === 'all' && filterPriority === 'all' && (
                    <Button onClick={() => navigate('/products')}>
                      <Package className="w-4 h-4 mr-2" />
                      Create Product
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canCreateProducts && (
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/products')}>
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/projects')}>
                <FolderOpen className="w-4 h-4 mr-2" />
                View Projects
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/templates')}>
                <FileText className="w-4 h-4 mr-2" />
                Project Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Team Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.project_name}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Access Level</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border-l-4 border-l-primary bg-primary/5 rounded">
                <p className="text-sm font-medium">Role: {userRole?.role?.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {userRole?.role === 'admin' && 'Full system access with all administrative privileges'}
                  {userRole?.role === 'manager' && 'Can create and manage products and projects'}
                  {userRole?.role === 'viewer' && 'Read-only access to assigned projects'}
                </p>
              </div>
              
              {userRole?.role === 'viewer' && (
                <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-500/5 rounded">
                  <p className="text-sm font-medium">Limited Access</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact an admin to request elevated permissions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}