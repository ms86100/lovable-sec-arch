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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Users, Edit, Trash2, Building, Mail, Phone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Stakeholder {
  id: string
  name: string
  email?: string
  department?: string
  role: string
  influence_level: string
  raci_role?: string
  contact_info?: any
  notes?: string
  is_internal: boolean
  created_at: string
}

interface StakeholdersManagerProps {
  projectId: string
  projectName: string
  readOnly?: boolean
}

export function StakeholdersManager({ projectId, projectName, readOnly = false }: StakeholdersManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'contributor',
    influence_level: 'medium',
    raci_role: '',
    phone: '',
    notes: '',
    is_internal: true
  })

  const fetchStakeholders = async () => {
    try {
      const { data, error } = await supabase
        .from('project_stakeholders')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setStakeholders(data || [])
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
    fetchStakeholders()
  }, [projectId])

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      role: 'contributor',
      influence_level: 'medium',
      raci_role: '',
      phone: '',
      notes: '',
      is_internal: true
    })
    setEditingStakeholder(null)
  }

  const openEditDialog = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder)
    setFormData({
      name: stakeholder.name,
      email: stakeholder.email || '',
      department: stakeholder.department || '',
      role: stakeholder.role,
      influence_level: stakeholder.influence_level,
      raci_role: stakeholder.raci_role || '',
      phone: stakeholder.contact_info?.phone || '',
      notes: stakeholder.notes || '',
      is_internal: stakeholder.is_internal
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const stakeholderData = {
        project_id: projectId,
        name: formData.name,
        email: formData.email || null,
        department: formData.department || null,
        role: formData.role,
        influence_level: formData.influence_level,
        raci_role: formData.raci_role || null,
        contact_info: formData.phone ? { phone: formData.phone } : null,
        notes: formData.notes || null,
        is_internal: formData.is_internal,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingStakeholder) {
        const { error } = await supabase
          .from('project_stakeholders')
          .update(stakeholderData)
          .eq('id', editingStakeholder.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Stakeholder updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_stakeholders')
          .insert(stakeholderData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Stakeholder added successfully"
        })
      }

      setIsDialogOpen(false)
      resetForm()
      fetchStakeholders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this stakeholder?')) return

    try {
      const { error } = await supabase
        .from('project_stakeholders')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Stakeholder deleted successfully"
      })

      fetchStakeholders()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'decision_maker': return 'default'
      case 'contributor': return 'secondary'
      case 'observer': return 'outline'
      default: return 'outline'
    }
  }

  if (loading) {
    return <div className="p-6">Loading stakeholders...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team & Stakeholders</h2>
          <p className="text-muted-foreground">Manage project stakeholders and team members for {projectName}</p>
        </div>
        
        {!readOnly && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Stakeholder
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
              </DialogTitle>
              <DialogDescription>
                Add team members and stakeholders to track roles and responsibilities
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="decision_maker">Decision Maker</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="influence">Influence Level</Label>
                  <Select value={formData.influence_level} onValueChange={(value) => setFormData({...formData, influence_level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raci">RACI Role</Label>
                  <Select value={formData.raci_role} onValueChange={(value) => setFormData({...formData, raci_role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select RACI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="responsible">Responsible</SelectItem>
                      <SelectItem value="accountable">Accountable</SelectItem>
                      <SelectItem value="consulted">Consulted</SelectItem>
                      <SelectItem value="informed">Informed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_internal"
                  checked={formData.is_internal}
                  onCheckedChange={(checked) => setFormData({...formData, is_internal: !!checked})}
                />
                <Label htmlFor="is_internal">Internal team member</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this stakeholder..."
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStakeholder ? 'Update' : 'Add'} Stakeholder
                </Button>
              </DialogFooter>
            </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {stakeholders.length > 0 ? (
          stakeholders.map((stakeholder) => (
            <Card key={stakeholder.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{stakeholder.name}</h3>
                      <Badge variant={getRoleColor(stakeholder.role)}>
                        {stakeholder.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getInfluenceColor(stakeholder.influence_level)}>
                        {stakeholder.influence_level} influence
                      </Badge>
                      {stakeholder.raci_role && (
                        <Badge variant="outline">
                          RACI: {stakeholder.raci_role}
                        </Badge>
                      )}
                      {!stakeholder.is_internal && (
                        <Badge variant="secondary">External</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                      {stakeholder.email && (
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {stakeholder.email}
                        </div>
                      )}
                      {stakeholder.department && (
                        <div className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {stakeholder.department}
                        </div>
                      )}
                      {stakeholder.contact_info?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {stakeholder.contact_info.phone}
                        </div>
                      )}
                    </div>
                    
                    {stakeholder.notes && (
                      <p className="text-sm text-muted-foreground">{stakeholder.notes}</p>
                    )}
                  </div>
                  
                  {!readOnly && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(stakeholder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(stakeholder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No stakeholders added</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding team members and stakeholders to track roles and responsibilities
              </p>
              {!readOnly && (
                <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Stakeholder
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}