import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Server, Edit, Trash2, Shield, Clock, Database } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'

interface ProjectServer {
  id: string
  server_name: string
  environment: string
  configuration_details?: any
  ownership_type: string
  last_assessment_date?: string
  assessment_type?: string
  export_control_status: string
  notes?: string
  created_at: string
}

interface InfrastructureManagerProps {
  projectId: string
  projectName: string
}

export function InfrastructureManager({ projectId, projectName }: InfrastructureManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [servers, setServers] = useState<ProjectServer[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingServer, setEditingServer] = useState<ProjectServer | null>(null)
  const [formData, setFormData] = useState({
    server_name: '',
    environment: 'dev',
    ownership_type: 'digital',
    last_assessment_date: '',
    assessment_type: '',
    export_control_status: 'not_assessed',
    cpu: '',
    memory: '',
    storage: '',
    notes: ''
  })

  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('project_servers')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setServers(data || [])
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

  useEffect(() => {
    fetchServers()
  }, [projectId])

  const resetForm = () => {
    setFormData({
      server_name: '',
      environment: 'dev',
      ownership_type: 'digital',
      last_assessment_date: '',
      assessment_type: '',
      export_control_status: 'not_assessed',
      cpu: '',
      memory: '',
      storage: '',
      notes: ''
    })
    setEditingServer(null)
  }

  const openEditDialog = (server: ProjectServer) => {
    setEditingServer(server)
    const config = server.configuration_details || {}
    setFormData({
      server_name: server.server_name,
      environment: server.environment,
      ownership_type: server.ownership_type,
      last_assessment_date: server.last_assessment_date || '',
      assessment_type: server.assessment_type || '',
      export_control_status: server.export_control_status,
      cpu: config.cpu || '',
      memory: config.memory || '',
      storage: config.storage || '',
      notes: server.notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const configuration = {
        cpu: formData.cpu || null,
        memory: formData.memory || null,
        storage: formData.storage || null
      }

      const serverData = {
        project_id: projectId,
        server_name: formData.server_name,
        environment: formData.environment,
        ownership_type: formData.ownership_type,
        last_assessment_date: formData.last_assessment_date || null,
        assessment_type: formData.assessment_type || null,
        export_control_status: formData.export_control_status,
        configuration_details: configuration,
        notes: formData.notes || null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingServer) {
        const { error } = await supabase
          .from('project_servers')
          .update(serverData)
          .eq('id', editingServer.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Server updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_servers')
          .insert(serverData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Server added successfully"
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchServers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this server?')) return

    try {
      const { error } = await supabase
        .from('project_servers')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Server deleted successfully"
      })

      fetchServers()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'prod': return 'destructive'
      case 'int': return 'default'
      case 'dev': return 'secondary'
      case 'test': return 'outline'
      default: return 'outline'
    }
  }

  const getExportControlColor = (status: string) => {
    switch (status) {
      case 'export_controlled': return 'destructive'
      case 'dual_use': return 'default'
      case 'military': return 'destructive'
      case 'not_controlled': return 'secondary'
      case 'not_assessed': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return <div className="p-6">Loading infrastructure...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Technical Infrastructure</h2>
          <p className="text-muted-foreground">Manage servers and technical infrastructure for {projectName}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Server
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingServer ? 'Edit Server' : 'Add New Server'}
              </DialogTitle>
              <DialogDescription>
                Track servers and infrastructure components for this project
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="server_name">Server Name *</Label>
                  <Input
                    id="server_name"
                    value={formData.server_name}
                    onChange={(e) => setFormData({...formData, server_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment *</Label>
                  <Select value={formData.environment} onValueChange={(value) => setFormData({...formData, environment: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dev">Development</SelectItem>
                      <SelectItem value="test">Test</SelectItem>
                      <SelectItem value="int">Integration</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                      <SelectItem value="non_prod">Non-Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownership_type">Ownership Type</Label>
                  <Select value={formData.ownership_type} onValueChange={(value) => setFormData({...formData, ownership_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="export_control_status">Export Control Status</Label>
                  <Select value={formData.export_control_status} onValueChange={(value) => setFormData({...formData, export_control_status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_assessed">Not Assessed</SelectItem>
                      <SelectItem value="not_controlled">Not Controlled</SelectItem>
                      <SelectItem value="export_controlled">Export Controlled</SelectItem>
                      <SelectItem value="dual_use">Dual Use</SelectItem>
                      <SelectItem value="military">Military</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Input
                    id="cpu"
                    value={formData.cpu}
                    onChange={(e) => setFormData({...formData, cpu: e.target.value})}
                    placeholder="e.g., 4 cores"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memory">Memory</Label>
                  <Input
                    id="memory"
                    value={formData.memory}
                    onChange={(e) => setFormData({...formData, memory: e.target.value})}
                    placeholder="e.g., 16GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input
                    id="storage"
                    value={formData.storage}
                    onChange={(e) => setFormData({...formData, storage: e.target.value})}
                    placeholder="e.g., 500GB SSD"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessment_type">Last Assessment Type</Label>
                  <Select value={formData.assessment_type} onValueChange={(value) => setFormData({...formData, assessment_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assessment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ard">ARD</SelectItem>
                      <SelectItem value="ors">ORS</SelectItem>
                      <SelectItem value="mrs">MRS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_assessment_date">Assessment Date</Label>
                  <Input
                    id="last_assessment_date"
                    type="date"
                    value={formData.last_assessment_date}
                    onChange={(e) => setFormData({...formData, last_assessment_date: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional configuration details or notes..."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingServer ? 'Update' : 'Add'} Server
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {servers.length > 0 ? (
          servers.map((server) => (
            <Card key={server.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{server.server_name}</h3>
                      <Badge variant={getEnvironmentColor(server.environment)}>
                        {server.environment.toUpperCase()}
                      </Badge>
                      <Badge variant={getExportControlColor(server.export_control_status)}>
                        {server.export_control_status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {server.ownership_type}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      {server.configuration_details?.cpu && (
                        <div className="flex items-center">
                          <Database className="w-3 h-3 mr-1" />
                          CPU: {server.configuration_details.cpu}
                        </div>
                      )}
                      {server.configuration_details?.memory && (
                        <div className="flex items-center">
                          <Database className="w-3 h-3 mr-1" />
                          Memory: {server.configuration_details.memory}
                        </div>
                      )}
                      {server.configuration_details?.storage && (
                        <div className="flex items-center">
                          <Database className="w-3 h-3 mr-1" />
                          Storage: {server.configuration_details.storage}
                        </div>
                      )}
                      {server.last_assessment_date && (
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Last {server.assessment_type?.toUpperCase()}: {format(new Date(server.last_assessment_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    
                    {server.notes && (
                      <p className="text-sm text-muted-foreground">{server.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(server)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(server.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No servers added</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding servers and infrastructure components for this project
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}