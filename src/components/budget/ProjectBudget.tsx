import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/hooks/use-toast"

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
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [summary, setSummary] = useState<BudgetSummary>({
    totalPlanned: 0,
    totalActual: 0,
    variance: 0,
    utilizationRate: 0,
    categoryBreakdown: {}
  })
  const [loading, setLoading] = useState(true)

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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget Item
              </Button>
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
                          <div className="text-right text-sm">
                            <div className="font-medium">
                              {formatCurrency(item.actual_amount || 0)}
                            </div>
                            <div className="text-muted-foreground">
                              of {formatCurrency(item.planned_amount || 0)}
                            </div>
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
    </div>
  )
}