import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Euro, Calendar, User, AlertCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AOPEntry {
  id: string
  activity: string
  task_description?: string
  category: string
  impact_risk_associated?: string
  amount_eur?: number
  aop_year?: number
  approver?: string
  created_at: string
  updated_at: string
}

interface ProjectAOPProps {
  projectId: string
  projectName: string
  readOnly?: boolean
}

const AOP_CATEGORIES = [
  'Development',
  'Enhancement', 
  'Bug Fixing',
  'Adaptive Maintenance',
  'Corrective Maintenance',
  'Preventive Maintenance',
  'Predictive Maintenance',
  'Obsolescence',
  'Run Mode / BAU (Business As Usual)',
  'Compliance & Security',
  'Infrastructure / Hosting',
  'Licensing',
  'Training & Enablement',
  'Monitoring & Support',
  'Documentation',
  'Change Request (CR)',
  'Transition / Handover'
]

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

export function ProjectAOP({ projectId, projectName, readOnly = false }: ProjectAOPProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [aopEntries, setAopEntries] = useState<AOPEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<AOPEntry | null>(null)
  const [formData, setFormData] = useState({
    activity: '',
    task_description: '',
    category: '',
    impact_risk_associated: '',
    amount_eur: '',
    aop_year: currentYear.toString(),
    approver: ''
  })

  useEffect(() => {
    if (projectId) {
      fetchAOPEntries()
    }
  }, [projectId])

  const fetchAOPEntries = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('project_aop')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAopEntries(data || [])
    } catch (error: any) {
      console.error('Error fetching AOP entries:', error)
      toast({
        title: "Error",
        description: "Failed to load AOP entries",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.activity || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Activity and Category are required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const submitData = {
        project_id: projectId,
        activity: formData.activity,
        task_description: formData.task_description || null,
        category: formData.category,
        impact_risk_associated: formData.impact_risk_associated || null,
        amount_eur: formData.amount_eur ? parseFloat(formData.amount_eur) : null,
        aop_year: formData.aop_year ? parseInt(formData.aop_year) : null,
        approver: formData.approver || null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingEntry) {
        const { error } = await supabase
          .from('project_aop')
          .update({ ...submitData, updated_by: user?.id })
          .eq('id', editingEntry.id)

        if (error) throw error
        toast({
          title: "Success",
          description: "AOP entry updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_aop')
          .insert([submitData])

        if (error) throw error
        toast({
          title: "Success", 
          description: "AOP entry created successfully"
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchAOPEntries()
    } catch (error: any) {
      console.error('Error saving AOP entry:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save AOP entry",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (entry: AOPEntry) => {
    setEditingEntry(entry)
    setFormData({
      activity: entry.activity,
      task_description: entry.task_description || '',
      category: entry.category,
      impact_risk_associated: entry.impact_risk_associated || '',
      amount_eur: entry.amount_eur?.toString() || '',
      aop_year: entry.aop_year?.toString() || currentYear.toString(),
      approver: entry.approver || ''
    })
    setDialogOpen(true)
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this AOP entry?')) return

    try {
      const { error } = await supabase
        .from('project_aop')
        .delete()
        .eq('id', entryId)

      if (error) throw error
      
      toast({
        title: "Success",
        description: "AOP entry deleted successfully"
      })
      fetchAOPEntries()
    } catch (error: any) {
      console.error('Error deleting AOP entry:', error)
      toast({
        title: "Error",
        description: "Failed to delete AOP entry",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      activity: '',
      task_description: '',
      category: '',
      impact_risk_associated: '',
      amount_eur: '',
      aop_year: currentYear.toString(),
      approver: ''
    })
    setEditingEntry(null)
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getCategoryBadgeVariant = (category: string) => {
    const developmentCategories = ['Development', 'Enhancement', 'Bug Fixing']
    const maintenanceCategories = ['Adaptive Maintenance', 'Corrective Maintenance', 'Preventive Maintenance', 'Predictive Maintenance']
    
    if (developmentCategories.includes(category)) return 'default'
    if (maintenanceCategories.includes(category)) return 'secondary'
    return 'outline'
  }

  const totalBudget = aopEntries.reduce((sum, entry) => sum + (entry.amount_eur || 0), 0)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Annual Operating Plan (AOP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading AOP entries...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Annual Operating Plan (AOP)
              </CardTitle>
              <CardDescription>
                Manage annual planning activities, budgets, and resources for {projectName}
              </CardDescription>
            </div>
            {!readOnly && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add AOP Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEntry ? 'Edit AOP Entry' : 'Add AOP Entry'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="activity">Activity *</Label>
                        <Input
                          id="activity"
                          value={formData.activity}
                          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                          placeholder="e.g., Software Development Phase 1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {AOP_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="task_description">Task / Description</Label>
                      <Textarea
                        id="task_description"
                        value={formData.task_description}
                        onChange={(e) => setFormData({ ...formData, task_description: e.target.value })}
                        placeholder="Detailed description of the activity or task"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="impact_risk">Impact / Risk Associated</Label>
                      <Textarea
                        id="impact_risk"
                        value={formData.impact_risk_associated}
                        onChange={(e) => setFormData({ ...formData, impact_risk_associated: e.target.value })}
                        placeholder="Describe potential impact and associated risks"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="amount">Amount (EUR)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={formData.amount_eur}
                          onChange={(e) => setFormData({ ...formData, amount_eur: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="aop_year">AOP Year</Label>
                        <Select
                          value={formData.aop_year}
                          onValueChange={(value) => setFormData({ ...formData, aop_year: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {yearOptions.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="approver">Approver</Label>
                        <Input
                          id="approver"
                          value={formData.approver}
                          onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                          placeholder="Approver name"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingEntry ? 'Update Entry' : 'Create Entry'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {aopEntries.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No AOP entries found for {projectName} - {currentYear}. Try adjusting filters or check with Approver.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Budget:</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Entries:</span>
                  <Badge variant="outline">{aopEntries.length}</Badge>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Task / Description</TableHead>
                      <TableHead>Impact / Risk</TableHead>
                      <TableHead>Amount (EUR)</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Approver</TableHead>
                      {!readOnly && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aopEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.activity}</TableCell>
                        <TableCell>
                          <Badge variant={getCategoryBadgeVariant(entry.category)}>
                            {entry.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={entry.task_description}>
                            {entry.task_description || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={entry.impact_risk_associated}>
                            {entry.impact_risk_associated || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(entry.amount_eur)}</TableCell>
                        <TableCell>{entry.aop_year || 'N/A'}</TableCell>
                        <TableCell>
                          {entry.approver ? (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3 text-muted-foreground" />
                              {entry.approver}
                            </div>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        {!readOnly && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(entry.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}