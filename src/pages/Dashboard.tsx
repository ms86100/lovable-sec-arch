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
  BarChart as BarChartIcon,
  Eye,
  MessageSquare,
  Folder,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns'
import { ProjectTimeline } from '@/components/timeline/ProjectTimeline'
import RiskDashboard from '@/components/risks/RiskDashboard'
import RACIMatrix from '@/components/raci/RACIMatrix'
import { BudgetTracker } from '@/components/budget/BudgetTracker'
import SecurityCenter from '@/components/security/SecurityCenter'
import { ProjectMilestones } from '@/components/milestones/ProjectMilestones'
import { ProjectBudget } from '@/components/budget/ProjectBudget'
import { StakeholdersManager } from '@/components/stakeholders/StakeholdersManager'


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
  // Project Health
  healthyProjects: number
  atRiskProjects: number
  criticalProjects: number
  // Budget
  totalBudget: number
  totalSpent: number
  // Tasks
  overdueTasks: number
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
  budget?: number
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

interface OverdueTask {
  id: string
  title: string
  due_date: string
  project_name: string
  milestone_title: string
  owner_name?: string
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
    avgProgress: 0,
    healthyProjects: 0,
    atRiskProjects: 0,
    criticalProjects: 0,
    totalBudget: 0,
    totalSpent: 0,
    overdueTasks: 0
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [overdueTasks, setOverdueTasks] = useState<OverdueTask[]>([])
  const [showOverdueList, setShowOverdueList] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Project filter states
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('all')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all')
  const [availableProjects, setAvailableProjects] = useState<Project[]>([])

  // Simplified UI states - removed legacy controls
  const [pinnedCards, setPinnedCards] = useState<Set<string>>(new Set())

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

      // Calculate basic stats
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
      const planningProjects = projects?.filter(p => p.status === 'planning').length || 0
      const onHoldProjects = projects?.filter(p => p.status === 'on_hold').length || 0
      
      // Projects created this week
      const weekStart = startOfWeek(new Date())
      const projectsThisWeek = projects?.filter(p => 
        new Date(p.created_at) >= weekStart
      ).length || 0

      // Calculate Project Health (Red, Amber, Green)
      const today = new Date()
      let healthyProjects = 0
      let atRiskProjects = 0
      let criticalProjects = 0

      projects?.forEach(project => {
        const progress = project.progress || 0
        const endDate = project.end_date ? new Date(project.end_date) : null
        const daysUntilDeadline = endDate ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null
        
        // Critical (Red): Overdue projects or no progress with approaching deadline
        if ((endDate && daysUntilDeadline < 0) || 
            (progress === 0 && daysUntilDeadline !== null && daysUntilDeadline <= 7) ||
            project.status === 'on_hold') {
          criticalProjects++
        }
        // At Risk (Amber): Behind schedule or minimal progress
        else if ((progress < 50 && daysUntilDeadline !== null && daysUntilDeadline <= 30) ||
                 (progress < 25 && project.status === 'active')) {
          atRiskProjects++
        }
        // Healthy (Green): On track
        else {
          healthyProjects++
        }
      })

      // Calculate milestone-based average progress
      const { data: tasks } = await supabase
        .from('project_tasks')
        .select('progress')

      let avgProgress = 0
      if (tasks && tasks.length > 0) {
        const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0)
        avgProgress = Math.round(totalProgress / tasks.length)
      }

      // Fetch budget data
      const { data: budgetItems } = await supabase
        .from('project_budget_items')
        .select('planned_amount, actual_amount')

      const totalBudget = budgetItems?.reduce((sum, item) => sum + (item.planned_amount || 0), 0) || 0
      const totalSpent = budgetItems?.reduce((sum, item) => sum + (item.actual_amount || 0), 0) || 0

      // Fetch overdue tasks with milestone and project info
      const { data: overdueTasksData } = await supabase
        .from('project_tasks')
        .select(`
          id,
          title,
          due_date,
          milestone_id
        `)
        .lt('due_date', today.toISOString().split('T')[0])
        .neq('status', 'completed')

      // Get milestone and project info for overdue tasks (simplified)
      const formattedOverdueTasks: OverdueTask[] = []
      if (overdueTasksData && overdueTasksData.length > 0) {
        // For now, create simplified entries
        overdueTasksData.forEach(task => {
          formattedOverdueTasks.push({
            id: task.id,
            title: task.title,
            due_date: task.due_date,
            project_name: 'Project TBD', // Will be enhanced later
            milestone_title: 'Milestone TBD' // Will be enhanced later
          })
        })
      }

      setOverdueTasks(formattedOverdueTasks)

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
        avgProgress,
        healthyProjects,
        atRiskProjects,
        criticalProjects,
        totalBudget,
        totalSpent,
        overdueTasks: formattedOverdueTasks.length
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
          budget,
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
          budget,
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


  const togglePinCard = (cardId: string) => {
    setPinnedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
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

      {/* Simplified Filter Controls */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Product Filter</label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="All Products" />
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
              <label className="text-sm font-medium">Project Filter</label>
              <Select 
                value={selectedProjectId} 
                onValueChange={setSelectedProjectId}
                disabled={selectedProductId === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
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
          </div>

          {/* Active Filters Display */}
          {(selectedProductId !== 'all' || selectedProjectId !== 'all') && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-muted/30 rounded-lg">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Active Filters:</span>
              {selectedProductId !== 'all' && (
                <Badge variant="secondary">
                  Product: {products.find(p => p.id === selectedProductId)?.name || 'Unknown'}
                </Badge>
              )}
              {selectedProjectId !== 'all' && (
                <Badge variant="secondary">
                  Project: {availableProjects.find(p => p.id === selectedProjectId)?.name || 'Unknown'}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Health Summary - Airbus Style */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-airbus-blue" />
          <h2 className="text-2xl font-bold text-airbus-blue">Project Health Overview</h2>
          {selectedProjectId !== 'all' && (
            <Badge variant="outline" className="ml-2">
              Filtered View: {availableProjects.find(p => p.id === selectedProjectId)?.name}
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Healthy Projects Card */}
          <Card className="airbus-card border-green-200 bg-green-50/30 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Healthy Projects</h3>
                    <p className="text-sm text-green-600">On track with no major issues</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{stats.healthyProjects}</div>
                  {stats.totalProjects > 0 && (
                    <div className="text-sm text-green-500">
                      {Math.round((stats.healthyProjects / stats.totalProjects) * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* At Risk Projects Card */}
          <Card className="airbus-card border-amber-200 bg-amber-50/30 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">At Risk Projects</h3>
                    <p className="text-sm text-amber-600">Delayed or behind schedule</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-600">{stats.atRiskProjects}</div>
                  {stats.totalProjects > 0 && (
                    <div className="text-sm text-amber-500">
                      {Math.round((stats.atRiskProjects / stats.totalProjects) * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Projects Card */}
          <Card className="airbus-card border-red-200 bg-red-50/30 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Critical Projects</h3>
                    <p className="text-sm text-red-600">Requiring immediate attention</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">{stats.criticalProjects}</div>
                  {stats.totalProjects > 0 && (
                    <div className="text-sm text-red-500">
                      {Math.round((stats.criticalProjects / stats.totalProjects) * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-airbus-blue" />
          <h2 className="text-2xl font-bold text-airbus-blue">Key Performance Indicators</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Average Progress */}
          <Card className="airbus-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Average Progress</h3>
                    <p className="text-sm text-muted-foreground">Based on task completion</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-600">{stats.avgProgress}%</div>
              </div>
              <Progress value={stats.avgProgress} className="h-2" />
            </CardContent>
          </Card>

          {/* Total Budget */}
          <Card className="airbus-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Total Budget</h3>
                    <p className="text-sm text-muted-foreground">Planned amount</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">${stats.totalBudget.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Total Spent */}
          <Card className="airbus-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Total Spent</h3>
                    <p className="text-sm text-muted-foreground">Actual amount</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">${stats.totalSpent.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Overdue Tasks */}
          <Card className="airbus-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Overdue Tasks</h3>
                    <p className="text-sm text-muted-foreground">Past due date</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOverdueList(!showOverdueList)}
                className="w-full"
              >
                {showOverdueList ? 'Hide' : 'View'} Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overdue Tasks List */}
      {showOverdueList && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Overdue Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length > 0 ? (
              <div className="space-y-2">
                {overdueTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.project_name} • {task.milestone_title}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}</Badge>
                      {task.owner_name && (
                        <p className="text-sm text-muted-foreground mt-1">{task.owner_name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No overdue tasks found.</p>
            )}
          </CardContent>
        </Card>
      )}

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
        <TabsList className="grid w-full lg:w-auto lg:grid-cols-12">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <BarChartIcon className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="cpm" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Critical Path
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
          <TabsTrigger value="stakeholders" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Stakeholders
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {/* Project Health Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Project Health Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Healthy', value: stats.healthyProjects, color: '#10B981' },
                        { name: 'At Risk', value: stats.atRiskProjects, color: '#F59E0B' },
                        { name: 'Critical', value: stats.criticalProjects, color: '#EF4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Healthy', value: stats.healthyProjects, color: '#10B981' },
                        { name: 'At Risk', value: stats.atRiskProjects, color: '#F59E0B' },
                        { name: 'Critical', value: stats.criticalProjects, color: '#EF4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget vs Spent Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Budget vs Spent', budget: stats.totalBudget, spent: stats.totalSpent }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="budget" fill="#10B981" name="Total Budget" />
                    <Bar dataKey="spent" fill="#3B82F6" name="Total Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Project Status Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { name: 'Active', count: stats.activeProjects },
                    { name: 'Planning', count: stats.planningProjects },
                    { name: 'Completed', count: stats.completedProjects },
                    { name: 'On Hold', count: stats.onHoldProjects }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

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
          {selectedProjectId && selectedProjectId !== 'all' ? (
            <ProjectTimeline 
              projectId={selectedProjectId} 
              projectName={recentProjects[0]?.name || 'Selected Project'}
              readOnly={true}
            />
          ) : (
            <ProjectMilestones 
              projectId={null} 
              readOnly={true} 
              showProjectNames={true}
            />
          )}
        </TabsContent>


        <TabsContent value="risks" className="space-y-6">
          <RiskDashboard 
            projectId={selectedProjectId !== 'all' ? selectedProjectId : undefined}
            showProjectNames={selectedProjectId === 'all'}
          />
        </TabsContent>

        <TabsContent value="raci" className="space-y-6">
          {selectedProjectId && selectedProjectId !== 'all' ? (
            <RACIMatrix projectId={selectedProjectId} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  RACI Matrix
                </CardTitle>
                <CardDescription>
                  Select a project to view its RACI assignments
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Performance metrics based on actual project data will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Performance Analytics Coming Soon</h3>
                <p className="text-sm">
                  This feature will calculate KPIs based on your actual project data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Resource Management
              </CardTitle>
              <CardDescription>
                Resource allocation features will be available when team member data is configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Resource Management Coming Soon</h3>
                <p className="text-sm">
                  This feature will show team capacity and project assignments once configured
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          {selectedProjectId && selectedProjectId !== 'all' ? (
            <BudgetTracker 
              projectId={selectedProjectId} 
              projectName={recentProjects[0]?.name || 'Selected Project'}
              readOnly={true}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cross-Project Budget View
                </CardTitle>
                <CardDescription>
                  Budget overview across all projects will be available once budget data is configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Cross-Project Budget Coming Soon</h3>
                  <p className="text-sm">
                    This feature will aggregate budget data across all projects with individual project names
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stakeholders" className="space-y-6">
          {selectedProjectId && selectedProjectId !== 'all' ? (
            <StakeholdersManager 
              projectId={selectedProjectId} 
              projectName={recentProjects[0]?.name || 'Selected Project'} 
              readOnly={true}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Cross-Project Stakeholders View
                </CardTitle>
                <CardDescription>
                  Stakeholder overview across all projects will be available once stakeholder data is configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Cross-Project Stakeholders Coming Soon</h3>
                  <p className="text-sm">
                    This feature will show stakeholder data across all projects with project identification
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
              <CardDescription>
                Advanced analytics and custom reports based on project data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-sm">
                  This feature will provide custom KPIs and detailed analytics once more project data is available
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Communication Hub
              </CardTitle>
              <CardDescription>
                Centralized communication logs and notifications will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Communication Hub Coming Soon</h3>
                <p className="text-sm">
                  This feature will track project communications and team interactions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {selectedProjectId && selectedProjectId !== 'all' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Documents
                </CardTitle>
                <CardDescription>
                  Documents for {recentProjects[0]?.name || 'Selected Project'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                  <p className="text-sm">
                    Upload documents in the project's Documents tab to see them here
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Repository
                </CardTitle>
                <CardDescription>
                  Select a project to view its documents
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="airbus-card">
              <CardContent className="p-12 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Security Center Available in Project View</h3>
                <p className="text-muted-foreground mb-4">
                  Please select a specific project to access security compliance and audit information.
                  Security data is project-specific and cannot be displayed at the global level.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Note about Security Data</span>
                  </div>
                  <p>
                    The Security Center currently uses demonstration data for display purposes. 
                    Real security audit logs and compliance data will be populated based on actual project activities and configurations.
                  </p>
                </div>
                {selectedProductId !== 'all' && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Select a project from the "{products.find(p => p.id === selectedProductId)?.name}" product above to view security details.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  )
}