import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Zap,
  Shield,
  BarChart,
  Eye,
  MessageSquare
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import ProjectTimeline from '@/components/timeline/ProjectTimeline'
import RiskDashboard from '@/components/risks/RiskDashboard'
import RACIMatrix from '@/components/raci/RACIMatrix'
import PerformanceDashboard from '@/components/performance/PerformanceDashboard'
import ResourceManager from '@/components/resources/ResourceManager'
import BudgetTracker from '@/components/budget/BudgetTracker'
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics'
import CommunicationHub from '@/components/communication/CommunicationHub'
import DocumentRepository from '@/components/documents/DocumentRepository'
import SecurityCenter from '@/components/security/SecurityCenter'

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

interface Product {
  id: string
  name: string
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
  
  // Project filter states
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('all')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])

  const canCreateProducts = hasRole('manager') || hasRole('admin')

  useEffect(() => {
    fetchDashboardData()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedProductId && selectedProductId !== 'all') {
      fetchProjectsForProduct(selectedProductId)
    } else {
      setAvailableProjects([])
      setSelectedProjectId('all')
    }
  }, [selectedProductId])

  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== 'all') {
      fetchProjectSpecificData()
    }
  }, [selectedProjectId])

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

  const fetchProducts = async () => {
    try {
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name')
        .order('name')
      
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchProjectsForProduct = async (productId: string) => {
    try {
      const { data: projectsData } = await supabase
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
        .eq('product_id', productId)
        .order('name')
      
      setAvailableProjects(projectsData || [])
    } catch (error) {
      console.error('Error fetching projects for product:', error)
    }
  }

  const fetchProjectSpecificData = async () => {
    if (!selectedProjectId || selectedProjectId === 'all') return
    
    try {
      // Update stats to be project-specific
      const { data: projectData } = await supabase
        .from('projects')
        .select(`
          *,
          products!inner (name)
        `)
        .eq('id', selectedProjectId)
        .single()

      if (projectData) {
        // Set project-specific data
        setRecentProjects([projectData])
        
        // Update stats for the selected project
        setStats(prev => ({
          ...prev,
          totalProjects: 1,
          activeProjects: projectData.status === 'active' ? 1 : 0,
          completedProjects: projectData.status === 'completed' ? 1 : 0,
          planningProjects: projectData.status === 'planning' ? 1 : 0,
          onHoldProjects: projectData.status === 'on_hold' ? 1 : 0,
          avgProgress: projectData.progress || 0
        }))

        // Generate project-specific activity
        const projectActivity: RecentActivity[] = [
          {
            id: projectData.id,
            type: 'project_created',
            project_name: projectData.name,
            user_name: 'System User',
            timestamp: projectData.created_at,
            description: `Project "${projectData.name}" was created`
          }
        ]
        setRecentActivity(projectActivity)
      }
    } catch (error) {
      console.error('Error fetching project-specific data:', error)
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
    <div className="space-y-6 p-6 animate-fade-in">
      {/* Header with Airbus styling */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-airbus-blue to-airbus-blue-light bg-clip-text text-transparent">
            Project Command Center
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Welcome back, {user?.email}! You have <span className="font-medium text-airbus-blue">{userRole?.role}</span> access.
          </p>
          {selectedProjectId && selectedProjectId !== 'all' && (
            <p className="text-sm text-airbus-blue mt-1">
              Viewing: {availableProjects.find(p => p.id === selectedProjectId)?.name}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          {canCreateProducts && (
            <Button className="airbus-button-primary" onClick={() => navigate('/products')}>
              <Package className="w-4 h-4 mr-2" />
              Manage Products
            </Button>
          )}
        </div>
      </div>

      {/* Project Filter */}
      <Card className="airbus-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-airbus-blue" />
            Project Filter
          </CardTitle>
          <CardDescription>
            Select a product and project to view specific data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product</label>
               <Select value={selectedProductId || 'all'} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select 
                value={selectedProjectId || 'all'} 
                onValueChange={setSelectedProjectId}
                disabled={!selectedProductId || selectedProductId === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {availableProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedProductId('all')
                  setSelectedProjectId('all')
                  fetchDashboardData()
                }}
                className="w-full"
              >
                Clear Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards with Airbus Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 animate-slide-up">
        <Card className="kpi-card group animate-scale-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <p className="text-3xl font-bold text-airbus-blue">{stats.totalProducts}</p>
                <p className="text-xs text-muted-foreground mt-1">Active portfolio</p>
              </div>
              <Package className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold text-airbus-blue">{stats.totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <FolderOpen className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{stats.activeProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">In progress</p>
              </div>
              <Activity className="h-8 w-8 text-success group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Week</p>
                <p className="text-3xl font-bold text-info">{stats.projectsThisWeek}</p>
                <p className="text-xs text-muted-foreground mt-1">New projects</p>
              </div>
              <Calendar className="h-8 w-8 text-info group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-3xl font-bold text-primary">{stats.avgProgress}%</p>
                <p className="text-xs text-muted-foreground mt-1">Overall completion</p>
              </div>
              <Target className="h-8 w-8 text-primary group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-3xl font-bold text-warning">{stats.templatesUsed}</p>
                <p className="text-xs text-muted-foreground mt-1">Using templates</p>
              </div>
              <FileText className="h-8 w-8 text-warning group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview Cards with Airbus styling */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        <Card className="airbus-card status-active">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-success rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-success">{stats.activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="airbus-card status-planning">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-info rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planning</p>
                <p className="text-3xl font-bold text-info">{stats.planningProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="airbus-card status-completed">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-primary rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-primary">{stats.completedProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="airbus-card status-warning">
          <CardContent className="flex items-center p-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-warning rounded-full shadow-lg"></div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Hold</p>
                <p className="text-3xl font-bold text-warning">{stats.onHoldProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Dashboard with Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto lg:grid-cols-11">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Risk Management
          </TabsTrigger>
          <TabsTrigger value="raci" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            RACI Matrix
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Recent Projects - Enhanced */}
            <div className="xl:col-span-3">
              <Card className="airbus-card">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-airbus-blue" />
                        Project Overview
                      </CardTitle>
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
                      <Select value={filterStatus || 'all'} onValueChange={setFilterStatus}>
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
                      <Select value={filterPriority || 'all'} onValueChange={setFilterPriority}>
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
                      <div key={project.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                           onClick={() => navigate(`/projects/${project.id}`)}>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium truncate group-hover:text-airbus-blue transition-colors">{project.name}</h4>
                              <Badge variant={getStatusVariant(project.status)} className="status-indicator">
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
              <Card className="airbus-card">
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
              <Card className="airbus-card">
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
              <Card className="airbus-card">
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
                    <div className="p-3 border-l-4 border-l-warning bg-warning/5 rounded">
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
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <ProjectTimeline 
            projects={selectedProjectId && selectedProjectId !== 'all' ? [recentProjects[0]].filter(Boolean) : filteredProjects} 
            onProjectClick={(id) => navigate(`/projects/${id}`)}
            selectedProjectId={selectedProjectId !== 'all' ? selectedProjectId : undefined}
          />
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <RiskDashboard />
        </TabsContent>

        <TabsContent value="raci" className="space-y-6">
          <RACIMatrix showAllProjects={true} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard timeframe="month" />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <ResourceManager />
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          <BudgetTracker />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationHub />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <DocumentRepository />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityCenter />
        </TabsContent>
      </Tabs>
    </div>
  )
}