import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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
  AlertTriangle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

interface DashboardStats {
  totalProducts: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
}

interface Project {
  id: string
  name: string
  status: string
  progress: number
  products: {
    name: string
  }
}

export default function Dashboard() {
  const { user, userRole, hasRole } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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

      // Fetch projects data
      const { data: projects, count: projectsCount } = await supabase
        .from('projects')
        .select(`
          *,
          products!inner (name)
        `, { count: 'exact' })

      const activeProjects = projects?.filter(p => p.status === 'active').length || 0
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0

      setStats({
        totalProducts: productsCount || 0,
        totalProjects: projectsCount || 0,
        activeProjects,
        completedProjects
      })

      // Get recent projects
      const { data: recentProjectsData } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          status,
          progress,
          products!inner (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setRecentProjects(recentProjectsData || [])

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Product portfolio</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">All projects</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjects}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Your latest project activity</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={getStatusVariant(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Package className="w-3 h-3 mr-1" />
                          {project.products.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first product to start managing projects
                  </p>
                  {canCreateProducts && (
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

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Team Management
              </Button>
            </CardContent>
          </Card>

          {/* Role Info */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Your Access Level</CardTitle>
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