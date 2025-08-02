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
import { ProjectTimeline } from '@/components/timeline/ProjectTimeline'
import { ProjectBudget } from '@/components/budget/ProjectBudget'
import { SecurityCompliance } from '@/components/security/SecurityCompliance'
import { ProjectDocumentation } from '@/components/documentation/ProjectDocumentation'
import { ProjectForm } from '@/components/forms/ProjectForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Edit,
  Shield
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

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditDialog, setShowEditDialog] = useState(false)

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
          products (
            name
          ),
          project_templates (
            name
          )
        `)
        .eq('id', id)
        .eq('is_active', true) // Only fetch active projects
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          toast({
            title: "Project Not Found",
            description: "The project you're looking for doesn't exist or has been deleted.",
            variant: "destructive"
          })
        } else {
          throw error
        }
        navigate('/projects')
        return
      }

      setProject(data)
    } catch (error: any) {
      console.error('Error fetching project:', error)
      toast({
        title: "Error",
        description: "Failed to load project details",
        variant: "destructive"
      })
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default'
      case 'planning': return 'secondary'
      case 'on_hold': return 'destructive'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive'
      case 'high': return 'default'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading project...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <Badge variant={getPriorityColor(project.priority)}>
                  {project.priority.replace(/\b\w/g, l => l.toUpperCase())} Priority
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {project.description || 'No description provided'}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit className="w-4 h-4" />
            Edit Project
          </Button>
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
          <TabsList className="grid w-full grid-cols-9 text-xs">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Budget
            </TabsTrigger>
            <TabsTrigger value="stakeholders" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Team
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="flex items-center gap-1">
              <Server className="w-3 h-3" />
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Risks
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Security
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
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
                    <div className="text-sm font-medium">Description</div>
                    <p className="text-sm text-muted-foreground">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <p className="text-sm">{project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Priority</div>
                      <p className="text-sm">{project.priority.replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>
                  </div>

                  {project.start_date && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Start Date</div>
                        <p className="text-sm">
                          {format(new Date(project.start_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      {project.end_date && (
                        <div>
                          <div className="text-sm font-medium">End Date</div>
                          <p className="text-sm">
                            {format(new Date(project.end_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {project.project_templates && (
                    <div>
                      <div className="text-sm font-medium">Template Used</div>
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

          <TabsContent value="timeline" className="space-y-6">
            <ProjectTimeline projectId={project.id} projectName={project.name} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <ProjectBudget projectId={project.id} projectBudget={project.budget} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityCompliance projectId={project.id} projectName={project.name} />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <ProjectDocumentation projectId={project.id} projectName={project.name} />
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-6">
            <StakeholdersManager projectId={project.id} projectName={project.name} />
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-6">
            <InfrastructureManager projectId={project.id} projectName={project.name} />
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
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
                    <Button onClick={() => setShowEditDialog(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
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

        {/* Edit Project Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={project}
              onSuccess={() => {
                setShowEditDialog(false)
                fetchProject()
              }}
              onCancel={() => setShowEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProjectDetails