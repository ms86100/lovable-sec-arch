import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Settings, 
  Download,
  Calendar,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface CustomKPI {
  id: string
  name: string
  description: string
  target: number
  current: number
  unit: string
  category: 'productivity' | 'quality' | 'efficiency' | 'satisfaction'
  trendDirection: 'up' | 'down' | 'stable'
}

interface ProductivityMetric {
  teamMember: string
  tasksCompleted: number
  avgDeliveryTime: number
  qualityScore: number
  velocityPoints: number
  period: string
}

interface ReportConfig {
  name: string
  kpis: string[]
  timeframe: string
  format: 'pdf' | 'excel' | 'dashboard'
  schedule: 'daily' | 'weekly' | 'monthly' | 'custom'
}

export function AdvancedAnalytics() {
  const [customKPIs, setCustomKPIs] = useState<CustomKPI[]>([])
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetric[]>([])
  const [reportConfigs, setReportConfigs] = useState<ReportConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      // In a real application, this would fetch from various data sources
      // including project management tools, time tracking, and quality metrics

      const mockKPIs: CustomKPI[] = [
        {
          id: '1',
          name: 'Sprint Velocity',
          description: 'Story points completed per sprint',
          target: 45,
          current: 52,
          unit: 'points',
          category: 'productivity',
          trendDirection: 'up'
        },
        {
          id: '2',
          name: 'Defect Rate',
          description: 'Bugs per feature delivered',
          target: 2,
          current: 1.3,
          unit: 'bugs/feature',
          category: 'quality',
          trendDirection: 'down'
        },
        {
          id: '3',
          name: 'Cycle Time',
          description: 'Average time from start to delivery',
          target: 5,
          current: 4.2,
          unit: 'days',
          category: 'efficiency',
          trendDirection: 'down'
        },
        {
          id: '4',
          name: 'Team Satisfaction',
          description: 'Team happiness index',
          target: 8.0,
          current: 8.3,
          unit: '/10',
          category: 'satisfaction',
          trendDirection: 'up'
        },
        {
          id: '5',
          name: 'Code Coverage',
          description: 'Percentage of code covered by tests',
          target: 85,
          current: 91,
          unit: '%',
          category: 'quality',
          trendDirection: 'up'
        },
        {
          id: '6',
          name: 'Deployment Frequency',
          description: 'Deployments per week',
          target: 3,
          current: 4.2,
          unit: 'deploys/week',
          category: 'efficiency',
          trendDirection: 'up'
        }
      ]

      const mockProductivityMetrics: ProductivityMetric[] = [
        {
          teamMember: 'Sarah Johnson',
          tasksCompleted: 28,
          avgDeliveryTime: 3.8,
          qualityScore: 94,
          velocityPoints: 42,
          period: 'Current Month'
        },
        {
          teamMember: 'Michael Chen',
          tasksCompleted: 32,
          avgDeliveryTime: 4.2,
          qualityScore: 88,
          velocityPoints: 38,
          period: 'Current Month'
        },
        {
          teamMember: 'Emily Rodriguez',
          tasksCompleted: 25,
          avgDeliveryTime: 3.5,
          qualityScore: 96,
          velocityPoints: 45,
          period: 'Current Month'
        },
        {
          teamMember: 'David Kim',
          tasksCompleted: 30,
          avgDeliveryTime: 4.8,
          qualityScore: 85,
          velocityPoints: 35,
          period: 'Current Month'
        }
      ]

      setCustomKPIs(mockKPIs)
      setProductivityMetrics(mockProductivityMetrics)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'productivity': return 'text-airbus-blue'
      case 'quality': return 'text-success'
      case 'efficiency': return 'text-warning'
      case 'satisfaction': return 'text-info'
      default: return 'text-muted-foreground'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'productivity': return <Zap className="w-4 h-4" />
      case 'quality': return <Target className="w-4 h-4" />
      case 'efficiency': return <TrendingUp className="w-4 h-4" />
      case 'satisfaction': return <Activity className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-success" />
      case 'down': return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
      default: return <div className="w-4 h-4 rounded-full bg-muted" />
    }
  }

  const getKPIStatus = (current: number, target: number, category: string) => {
    const ratio = current / target
    
    // For categories where lower is better (like defect rate, cycle time)
    const lowerIsBetter = ['quality', 'efficiency'].includes(category) && 
                         (current < target) // Assuming lower values are better for these specific metrics
    
    if (lowerIsBetter) {
      if (ratio <= 0.8) return { status: 'excellent', color: 'text-success' }
      if (ratio <= 1.0) return { status: 'good', color: 'text-airbus-blue' }
      if (ratio <= 1.2) return { status: 'warning', color: 'text-warning' }
      return { status: 'critical', color: 'text-destructive' }
    } else {
      if (ratio >= 1.2) return { status: 'excellent', color: 'text-success' }
      if (ratio >= 1.0) return { status: 'good', color: 'text-airbus-blue' }
      if (ratio >= 0.8) return { status: 'warning', color: 'text-warning' }
      return { status: 'critical', color: 'text-destructive' }
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-airbus-blue">Advanced Analytics & Reporting</h3>
          <p className="text-muted-foreground">Configurable KPIs, productivity metrics, and custom reports</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kpis">Custom KPIs</TabsTrigger>
          <TabsTrigger value="productivity">Team Productivity</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="kpis" className="space-y-6">
          {/* KPI Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customKPIs.map((kpi) => {
              const status = getKPIStatus(kpi.current, kpi.target, kpi.category)
              const progressValue = Math.min((kpi.current / kpi.target) * 100, 100)
              
              return (
                <Card key={kpi.id} className="airbus-card group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={getCategoryColor(kpi.category)}>
                          {getCategoryIcon(kpi.category)}
                        </span>
                        <div>
                          <CardTitle className="text-base">{kpi.name}</CardTitle>
                          <CardDescription className="text-xs">{kpi.description}</CardDescription>
                        </div>
                      </div>
                      {getTrendIcon(kpi.trendDirection)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className={`text-3xl font-bold ${status.color}`}>
                          {kpi.current}{kpi.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Target: {kpi.target}{kpi.unit}
                        </p>
                      </div>
                      <Badge 
                        variant={status.status === 'excellent' ? 'default' : 
                                status.status === 'good' ? 'secondary' :
                                status.status === 'warning' ? 'outline' : 'destructive'}
                        className="capitalize"
                      >
                        {status.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <Progress value={progressValue} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>{kpi.target}{kpi.unit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-airbus-blue" />
                Team Productivity Metrics
              </CardTitle>
              <CardDescription>
                Individual and team performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productivityMetrics.map((metric, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-lg">{metric.teamMember}</h4>
                      <Badge variant="outline">{metric.period}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-airbus-blue">{metric.tasksCompleted}</p>
                        <p className="text-xs text-muted-foreground">Tasks Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">{metric.avgDeliveryTime}d</p>
                        <p className="text-xs text-muted-foreground">Avg Delivery Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-warning">{metric.qualityScore}%</p>
                        <p className="text-xs text-muted-foreground">Quality Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-info">{metric.velocityPoints}</p>
                        <p className="text-xs text-muted-foreground">Velocity Points</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Progress value={metric.qualityScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-airbus-blue" />
                Custom Reports & Dashboards
              </CardTitle>
              <CardDescription>
                Create and schedule automated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Custom Reports Coming Soon</h3>
                <p className="text-sm mb-4">
                  This feature will allow you to create custom dashboards and automated reports
                </p>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-airbus-blue" />
                Analytics Configuration
              </CardTitle>
              <CardDescription>
                Configure data sources, thresholds, and alert settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">KPI Thresholds</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="velocity-target">Sprint Velocity Target</Label>
                      <Input id="velocity-target" type="number" placeholder="45" />
                    </div>
                    <div>
                      <Label htmlFor="quality-target">Quality Score Target</Label>
                      <Input id="quality-target" type="number" placeholder="90" />
                    </div>
                    <div>
                      <Label htmlFor="cycle-target">Cycle Time Target (days)</Label>
                      <Input id="cycle-target" type="number" placeholder="5" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Alert Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">KPI threshold alerts</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Weekly summary reports</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <span className="text-sm">Budget variance alerts</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="airbus-button-primary">
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAnalytics