import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  PieChart, 
  BarChart3,
  Calculator,
  Target,
  Wallet
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface BudgetData {
  projectId: string
  projectName: string
  plannedBudget: number
  actualSpent: number
  categories: {
    manpower: { planned: number, actual: number }
    tools: { planned: number, actual: number }
    licenses: { planned: number, actual: number }
    travel: { planned: number, actual: number }
    infrastructure: { planned: number, actual: number }
  }
  variance: number
  utilizationRate: number
}

interface FinancialKPI {
  totalBudget: number
  totalSpent: number
  budgetUtilization: number
  avgProjectVariance: number
  projectsOverBudget: number
  forecastedSpend: number
}

export function BudgetTracker() {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([])
  const [kpis, setKpis] = useState<FinancialKPI>({
    totalBudget: 0,
    totalSpent: 0,
    budgetUtilization: 0,
    avgProjectVariance: 0,
    projectsOverBudget: 0,
    forecastedSpend: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter')

  useEffect(() => {
    fetchBudgetData()
  }, [selectedTimeframe])

  const fetchBudgetData = async () => {
    try {
      // Fetch project budgets from database
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, budget, status')
        .not('budget', 'is', null)

      // Generate mock budget data (in real app, this would come from financial systems)
      const mockBudgetData: BudgetData[] = [
        {
          projectId: '1',
          projectName: 'Alpha Digital Transformation',
          plannedBudget: 850000,
          actualSpent: 620000,
          categories: {
            manpower: { planned: 500000, actual: 380000 },
            tools: { planned: 150000, actual: 125000 },
            licenses: { planned: 100000, actual: 85000 },
            travel: { planned: 50000, actual: 20000 },
            infrastructure: { planned: 50000, actual: 10000 }
          },
          variance: -230000,
          utilizationRate: 73
        },
        {
          projectId: '2',
          projectName: 'Beta Cloud Migration',
          plannedBudget: 650000,
          actualSpent: 720000,
          categories: {
            manpower: { planned: 350000, actual: 420000 },
            tools: { planned: 120000, actual: 140000 },
            licenses: { planned: 80000, actual: 85000 },
            travel: { planned: 30000, actual: 25000 },
            infrastructure: { planned: 70000, actual: 50000 }
          },
          variance: 70000,
          utilizationRate: 111
        },
        {
          projectId: '3',
          projectName: 'Gamma Security Enhancement',
          plannedBudget: 450000,
          actualSpent: 380000,
          categories: {
            manpower: { planned: 250000, actual: 220000 },
            tools: { planned: 100000, actual: 90000 },
            licenses: { planned: 60000, actual: 45000 },
            travel: { planned: 20000, actual: 15000 },
            infrastructure: { planned: 20000, actual: 10000 }
          },
          variance: -70000,
          utilizationRate: 84
        },
        {
          projectId: '4',
          projectName: 'Delta Process Automation',
          plannedBudget: 320000,
          actualSpent: 350000,
          categories: {
            manpower: { planned: 180000, actual: 200000 },
            tools: { planned: 80000, actual: 85000 },
            licenses: { planned: 40000, actual: 45000 },
            travel: { planned: 10000, actual: 10000 },
            infrastructure: { planned: 10000, actual: 10000 }
          },
          variance: 30000,
          utilizationRate: 109
        }
      ]

      setBudgetData(mockBudgetData)

      // Calculate KPIs
      const totalBudget = mockBudgetData.reduce((sum, p) => sum + p.plannedBudget, 0)
      const totalSpent = mockBudgetData.reduce((sum, p) => sum + p.actualSpent, 0)
      const budgetUtilization = Math.round((totalSpent / totalBudget) * 100)
      const avgProjectVariance = Math.round(mockBudgetData.reduce((sum, p) => sum + Math.abs(p.variance), 0) / mockBudgetData.length)
      const projectsOverBudget = mockBudgetData.filter(p => p.actualSpent > p.plannedBudget).length
      const forecastedSpend = Math.round(totalSpent * 1.15) // Forecast 15% more spending

      setKpis({
        totalBudget,
        totalSpent,
        budgetUtilization,
        avgProjectVariance,
        projectsOverBudget,
        forecastedSpend
      })

    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-destructive'
    if (variance < 0) return 'text-success'
    return 'text-muted-foreground'
  }

  const getUtilizationColor = (rate: number) => {
    if (rate > 105) return 'text-destructive'
    if (rate > 95) return 'text-warning'
    if (rate > 80) return 'text-success'
    return 'text-info'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="airbus-card">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-airbus-blue">Budget & Financial Management</h3>
          <p className="text-muted-foreground">Track spending, variance, and financial performance</p>
        </div>
        <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-3xl font-bold text-airbus-blue">{formatCurrency(kpis.totalBudget)}</p>
                <p className="text-xs text-muted-foreground mt-1">Allocated across projects</p>
              </div>
              <Wallet className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actual Spent</p>
                <p className="text-3xl font-bold text-airbus-blue">{formatCurrency(kpis.totalSpent)}</p>
                <p className="text-xs text-muted-foreground mt-1">Current expenditure</p>
              </div>
              <DollarSign className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                <p className={`text-3xl font-bold ${getUtilizationColor(kpis.budgetUtilization)}`}>
                  {kpis.budgetUtilization}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">Spend efficiency</p>
              </div>
              <Target className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Variance</p>
                <p className="text-3xl font-bold text-warning">{formatCurrency(kpis.avgProjectVariance)}</p>
                <p className="text-xs text-muted-foreground mt-1">Per project</p>
              </div>
              <Calculator className="h-8 w-8 text-warning group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Over Budget</p>
                <p className="text-3xl font-bold text-destructive">{kpis.projectsOverBudget}</p>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Forecasted</p>
                <p className="text-3xl font-bold text-info">{formatCurrency(kpis.forecastedSpend)}</p>
                <p className="text-xs text-muted-foreground mt-1">Year-end projection</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Details */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Project Budgets</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {budgetData.map((project) => (
            <Card key={project.projectId} className="airbus-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.projectName}</CardTitle>
                    <CardDescription>
                      Budget utilization and variance analysis
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={project.utilizationRate > 105 ? 'destructive' : project.utilizationRate > 95 ? 'outline' : 'secondary'}
                  >
                    {project.utilizationRate}% utilized
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Planned Budget</p>
                    <p className="text-2xl font-bold text-airbus-blue">{formatCurrency(project.plannedBudget)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actual Spent</p>
                    <p className="text-2xl font-bold text-airbus-blue">{formatCurrency(project.actualSpent)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Variance</p>
                    <p className={`text-2xl font-bold ${getVarianceColor(project.variance)}`}>
                      {project.variance > 0 ? '+' : ''}{formatCurrency(project.variance)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Budget Utilization</span>
                    <span className={getUtilizationColor(project.utilizationRate)}>
                      {project.utilizationRate}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(project.utilizationRate, 100)} 
                    className="h-3"
                  />
                  {project.utilizationRate > 100 && (
                    <p className="text-xs text-destructive mt-1">
                      Exceeds budget by {project.utilizationRate - 100}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-airbus-blue" />
                Spending by Category
              </CardTitle>
              <CardDescription>
                Breakdown of expenses across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(budgetData[0]?.categories || {}).map(([category, data]) => (
                  <div key={category} className="text-center p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm capitalize mb-2">{category}</h4>
                    <p className="text-lg font-bold text-airbus-blue">
                      {formatCurrency(data.actual)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      vs {formatCurrency(data.planned)} planned
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={(data.actual / data.planned) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-airbus-blue" />
                Spending Trends
              </CardTitle>
              <CardDescription>
                Historical and projected spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-sm">
                  This section will display interactive charts and trend analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BudgetTracker