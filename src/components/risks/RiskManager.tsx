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
import { Plus, AlertTriangle, Edit, Trash2, User, Calendar, Target } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { format } from 'date-fns'

interface ProjectRisk {
  id: string
  title: string
  description?: string
  category: string
  severity_level: string
  probability: string
  impact: string
  risk_score: number
  status: string
  mitigation_strategy?: string
  risk_owner?: string
  assigned_to?: string
  due_date?: string
  resolution_date?: string
  resolution_notes?: string
  created_at: string
}

interface RiskManagerProps {
  projectId: string
  projectName: string
}

export function RiskManager({ projectId, projectName }: RiskManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [risks, setRisks] = useState<ProjectRisk[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRisk, setEditingRisk] = useState<ProjectRisk | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'operational',
    severity_level: 'medium',
    probability: 'medium',
    impact: 'medium',
    status: 'open',
    mitigation_strategy: '',
    due_date: '',
    resolution_notes: ''
  })

  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from('project_risks')
        .select('*')
        .eq('project_id', projectId)
        .order('risk_score', { ascending: false })

      if (error) throw error
      setRisks(data || [])
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
    fetchRisks()
  }, [projectId])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'operational',
      severity_level: 'medium',
      probability: 'medium',
      impact: 'medium',
      status: 'open',
      mitigation_strategy: '',
      due_date: '',
      resolution_notes: ''
    })
    setEditingRisk(null)
  }

  const openEditDialog = (risk: ProjectRisk) => {
    setEditingRisk(risk)
    setFormData({
      title: risk.title,
      description: risk.description || '',
      category: risk.category,
      severity_level: risk.severity_level,
      probability: risk.probability,
      impact: risk.impact,
      status: risk.status,
      mitigation_strategy: risk.mitigation_strategy || '',
      due_date: risk.due_date || '',
      resolution_notes: risk.resolution_notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const riskData = {
        project_id: projectId,
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        severity_level: formData.severity_level,
        probability: formData.probability,
        impact: formData.impact,
        status: formData.status,
        mitigation_strategy: formData.mitigation_strategy || null,
        due_date: formData.due_date || null,
        resolution_date: formData.status === 'resolved' ? new Date().toISOString().split('T')[0] : null,
        resolution_notes: formData.resolution_notes || null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingRisk) {
        const { error } = await supabase
          .from('project_risks')
          .update(riskData)
          .eq('id', editingRisk.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Risk updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_risks')
          .insert(riskData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Risk added successfully"
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchRisks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this risk?')) return

    try {
      const { error } = await supabase
        .from('project_risks')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Risk deleted successfully"
      })

      fetchRisks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive'
      case 'in_progress': return 'default'
      case 'resolved': return 'secondary'
      case 'escalated': return 'destructive'
      case 'accepted': return 'outline'
      default: return 'outline'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 20) return 'destructive'
    if (score >= 12) return 'default'
    if (score >= 6) return 'outline'
    return 'secondary'
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧'
      case 'financial': return '💰'
      case 'compliance': return '📋'
      case 'strategic': return '🎯'
      default: return '⚙️'
    }
  }

  if (loading) {
    return <div className="p-6">Loading risks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Management</h2>
          <p className="text-muted-foreground">Track and manage project risks for {projectName}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Risk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRisk ? 'Edit Risk' : 'Add New Risk'}
              </DialogTitle>
              <DialogDescription>
                Track project risks and their mitigation strategies
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Risk Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the risk..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level</Label>
                  <Select value={formData.severity_level} onValueChange={(value) => setFormData({...formData, severity_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability</Label>
                  <Select value={formData.probability} onValueChange={(value) => setFormData({...formData, probability: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="very_high">Very High</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="very_low">Very Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Select value={formData.impact} onValueChange={(value) => setFormData({...formData, impact: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mitigation_strategy">Mitigation Strategy</Label>
                <Textarea
                  id="mitigation_strategy"
                  value={formData.mitigation_strategy}
                  onChange={(e) => setFormData({...formData, mitigation_strategy: e.target.value})}
                  placeholder="How will this risk be mitigated or managed..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
                {formData.status === 'resolved' && (
                  <div className="space-y-2">
                    <Label htmlFor="resolution_notes">Resolution Notes</Label>
                    <Textarea
                      id="resolution_notes"
                      value={formData.resolution_notes}
                      onChange={(e) => setFormData({...formData, resolution_notes: e.target.value})}
                      placeholder="How was this risk resolved..."
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRisk ? 'Update' : 'Add'} Risk
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {risks.filter(r => r.status === 'open').length}
            </div>
            <p className="text-sm text-muted-foreground">Open Risks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-500">
              {risks.filter(r => r.status === 'in_progress').length}
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {risks.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-500">
              {risks.filter(r => r.risk_score >= 15).length}
            </div>
            <p className="text-sm text-muted-foreground">High Risk Score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {risks.length > 0 ? (
          risks.map((risk) => (
            <Card key={risk.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(risk.category)}</span>
                      <h3 className="font-medium">{risk.title}</h3>
                      <Badge variant={getRiskScoreColor(risk.risk_score)}>
                        Risk Score: {risk.risk_score}
                      </Badge>
                      <Badge variant={getStatusColor(risk.status)}>
                        {risk.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getSeverityColor(risk.severity_level)}>
                        {risk.severity_level}
                      </Badge>
                    </div>
                    
                    {risk.description && (
                      <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Target className="w-3 h-3 mr-1" />
                        Impact: {risk.impact} | Probability: {risk.probability}
                      </div>
                      {risk.due_date && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due: {format(new Date(risk.due_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                    
                    {risk.mitigation_strategy && (
                      <div className="text-sm">
                        <strong>Mitigation:</strong> {risk.mitigation_strategy}
                      </div>
                    )}
                    
                    {risk.resolution_notes && (
                      <div className="text-sm text-green-600">
                        <strong>Resolution:</strong> {risk.resolution_notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(risk)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(risk.id)}
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
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No risks identified</h3>
              <p className="text-muted-foreground mb-4">
                Start by identifying and tracking potential project risks
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}