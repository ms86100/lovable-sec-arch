import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, Plus, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from '@/hooks/useAuth'
import { toast } from "@/hooks/use-toast"
import { BudgetSpending } from './BudgetSpending'

interface BudgetItem {
  id: string
  category: string
  item_name: string
  planned_amount: number
  actual_amount: number
  description: string | null
  date_incurred: string | null
}

interface BudgetSummary {
  totalPlanned: number
  totalActual: number
  variance: number
  utilizationRate: number
  categoryBreakdown: { [key: string]: { planned: number; actual: number } }
}

interface ProjectBudgetProps {
  projectId: string | null
  projectBudget?: number
  readOnly?: boolean
}

export function ProjectBudget({ projectId, projectBudget, readOnly = false }: ProjectBudgetProps) {
  const { user } = useAuth()
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [summary, setSummary] = useState<BudgetSummary>({
    totalPlanned: 0,
    totalActual: 0,
    variance: 0,
    utilizationRate: 0,
    categoryBreakdown: {}
  })
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null)

  const [formData, setFormData] = useState({
    category: 'labor',
    item_name: '',
    planned_amount: '',
    actual_amount: '',
    description: ''
  })

  useEffect(() => {
    if (projectId) {
      fetchBudgetData()
    } else {
      setBudgetItems([])
      setSummary({
        totalPlanned: 0,
        totalActual: 0,
        variance: 0,
        utilizationRate: 0,
        categoryBreakdown: {}
      })
      setLoading(false)
    }
  }, [projectId])

  const fetchBudgetData = async () => {
    if (!projectId) return

    try {
      setLoading(true)
      
      const { data: budgetData, error } = await supabase
        .from('project_budget_items')
        .select('*')
        .eq('project_id', projectId)
        .order('category', { ascending: true })

      if (error) throw error

      setBudgetItems(budgetData || [])
      
      // Calculate summary
      const items = budgetData || []
      const totalPlanned = items.reduce((sum, item) => sum + (item.planned_amount || 0), 0)
      const totalActual = items.reduce((sum, item) => sum + (item.actual_amount || 0), 0)
      const variance = totalActual - totalPlanned
      const utilizationRate = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0

      // Category breakdown
      const categoryBreakdown: { [key: string]: { planned: number; actual: number } } = {}
      items.forEach(item => {
        if (!categoryBreakdown[item.category]) {
          categoryBreakdown[item.category] = { planned: 0, actual: 0 }
        }
        categoryBreakdown[item.category].planned += item.planned_amount || 0
        categoryBreakdown[item.category].actual += item.actual_amount || 0
      })

      setSummary({
        totalPlanned,
        totalActual,
        variance,
        utilizationRate,
        categoryBreakdown
      })
    } catch (error) {
      console.error('Error fetching budget data:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load project budget data."
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category: 'labor',
      item_name: '',
      planned_amount: '',
      actual_amount: '',
      description: ''
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: BudgetItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      item_name: item.item_name,
      planned_amount: item.planned_amount.toString(),
      actual_amount: item.actual_amount.toString(),
      description: item.description || ''
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const budgetData = {
        project_id: projectId,
        category: formData.category,
        item_name: formData.item_name,
        planned_amount: parseFloat(formData.planned_amount) || 0,
        actual_amount: parseFloat(formData.actual_amount) || 0,
        description: formData.description || null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingItem) {
        const { error } = await supabase
          .from('project_budget_items')
          .update(budgetData)
          .eq('id', editingItem.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Budget item updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_budget_items')
          .insert(budgetData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Budget item added successfully"
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchBudgetData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget item?')) return

    try {
      const { error } = await supabase
        .from('project_budget_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Budget item deleted successfully"
      })

      fetchBudgetData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600'
    if (variance < 0) return 'text-green-600'
    return 'text-gray-600'
  }

  const getUtilizationColor = (rate: number) => {
    if (rate > 100) return 'bg-red-100 text-red-800'
    if (rate > 80) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Project Budget
          </CardTitle>
          <CardDescription>
            Select a project to view its budget details
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Project Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Planned</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(summary.totalPlanned)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Total Spent</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {formatCurrency(summary.totalActual)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {summary.variance >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm font-medium">Variance</span>
            </div>
            <div className={`text-2xl font-bold mt-1 ${getVarianceColor(summary.variance)}`}>
              {summary.variance >= 0 ? '+' : ''}{formatCurrency(summary.variance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Utilization</span>
              <Badge className={getUtilizationColor(summary.utilizationRate)}>
                {summary.utilizationRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={Math.min(summary.utilizationRate, 100)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Budget Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Budget Items</CardTitle>
              <CardDescription>
                Detailed breakdown of planned vs actual spending
              </CardDescription>
            </div>
            {!readOnly && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => { resetForm(); setDialogOpen(true) }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Budget Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Edit Budget Item' : 'Add New Budget Item'}
                    </DialogTitle>
                    <DialogDescription>
                      Track planned vs actual spending for project expenses
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="labor">Labor</SelectItem>
                            <SelectItem value="materials">Materials</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="travel">Travel</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item_name">Item Name *</Label>
                        <Input
                          id="item_name"
                          value={formData.item_name}
                          onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planned_amount">Planned Amount ($) *</Label>
                        <Input
                          id="planned_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.planned_amount}
                          onChange={(e) => setFormData({...formData, planned_amount: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="actual_amount">Actual Amount ($)</Label>
                        <Input
                          id="actual_amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.actual_amount}
                          onChange={(e) => setFormData({...formData, actual_amount: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Additional details about this expense..."
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingItem ? 'Update' : 'Add'} Budget Item
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {budgetItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No budget items found</p>
              <p className="text-sm">Add budget items to track spending</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(summary.categoryBreakdown).map(([category, amounts]) => (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold capitalize">{category}</h3>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(amounts.actual)} / {formatCurrency(amounts.planned)}
                      </div>
                      <Progress 
                        value={amounts.planned > 0 ? (amounts.actual / amounts.planned) * 100 : 0} 
                        className="w-24 mt-1" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {budgetItems
                      .filter(item => item.category === category)
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <span className="text-sm font-medium">{item.item_name}</span>
                            {item.description && (
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right text-sm">
                              <div className="font-medium">
                                {formatCurrency(item.actual_amount || 0)}
                              </div>
                              <div className="text-muted-foreground">
                                of {formatCurrency(item.planned_amount || 0)}
                              </div>
                            </div>
                            {!readOnly && (
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Spending Information Section */}
      <BudgetSpending projectId={projectId} readOnly={readOnly} />
    </div>
  )
}