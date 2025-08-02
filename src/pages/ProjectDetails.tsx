import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StakeholdersManager } from '@/components/stakeholders/StakeholdersManager'
import { InfrastructureManager } from '@/components/infrastructure/InfrastructureManager'
import { RiskManager } from '@/components/risks/RiskManager'
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Package, 
  DollarSign, 
  Target,
  Users,
  Server,
  AlertTriangle,
  FileText,
  Settings,
  Edit
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Project {
  id: string
  name: string
  description?: string
  status: string
  priority: string
  progress: number
  budget?: number
  start_date?: string
  end_date?: string
  created_at: string
  assigned_to?: string
  template_id?: string
  products: {
    name: string
  }
  project_templates?: {
    name: string
  }
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const canEdit = hasRole('manager') || hasRole('admin')

  useEffect(() => {
    if (id) {
      fetchProject()
    }
  }, [id])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          products!inner (name),
          project_templates (name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'on_hold': return 'outline'
      case 'planning': return 'outline'
      case 'cancelled': return 'destructive'
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant={getStatusColor(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
              <Badge variant={getPriorityColor(project.priority)}>
                {project.priority} priority
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {project.description || 'No description provided'}
            </p>
          </div>
        </div>
        
        {canEdit && (
          <Button onClick={() => navigate(`/projects/edit/${project.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        )}
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Product</p>
                <p className="text-lg font-bold">{project.products.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Progress</p>
                <div className="flex items-center space-x-2">
                  <Progress value={project.progress} className="flex-1" />
                  <span className="text-lg font-bold">{project.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {project.budget && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-lg font-bold">${project.budget.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-lg font-bold">
                  {format(new Date(project.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="stakeholders" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team & Stakeholders
          </TabsTrigger>
          <TabsTrigger value="infrastructure" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Management
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground">
                    {project.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-sm">{project.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <p className="text-sm">{project.priority}</p>
                  </div>
                </div>

                {project.start_date && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Start Date</Label>
                      <p className="text-sm">
                        {format(new Date(project.start_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    {project.end_date && (
                      <div>
                        <Label className="text-sm font-medium">End Date</Label>
                        <p className="text-sm">
                          {format(new Date(project.end_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {project.project_templates && (
                  <div>
                    <Label className="text-sm font-medium">Template Used</Label>
                    <p className="text-sm">{project.project_templates.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                  
                  {project.budget && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Budget</span>
                      <span className="font-medium">${project.budget.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Created</span>
                    <span className="font-medium">
                      {format(new Date(project.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stakeholders">
          <StakeholdersManager projectId={project.id} projectName={project.name} />
        </TabsContent>

        <TabsContent value="infrastructure">
          <InfrastructureManager projectId={project.id} projectName={project.name} />
        </TabsContent>

        <TabsContent value="risks">
          <RiskManager projectId={project.id} projectName={project.name} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
              <CardDescription>
                Configure project settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Edit Project Details</h4>
                    <p className="text-sm text-muted-foreground">Update project information, dates, and settings</p>
                  </div>
                  {canEdit && (
                    <Button onClick={() => navigate(`/projects/edit/${project.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium">Custom Fields</h4>
                    <p className="text-sm text-muted-foreground">Manage custom fields for this project</p>
                  </div>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>
}