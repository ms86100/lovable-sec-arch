import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BarChart3, Target, TrendingUp, DollarSign, Calendar, Clock, Users, Activity } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface KPIData {
  projectsCompleted: number
  budgetUtilization: number
  avgDeliveryTime: number
  teamProductivity: number
  riskMitigationRate: number
  stakeholderSatisfaction: number
}

interface PerformanceProps {
  timeframe?: 'week' | 'month' | 'quarter'
}

export function PerformanceDashboard({ timeframe = 'month' }: PerformanceProps) {
  const [kpiData, setKpiData] = useState<KPIData>({
    projectsCompleted: 0,
    budgetUtilization: 0,
    avgDeliveryTime: 0,
    teamProductivity: 0,
    riskMitigationRate: 0,
    stakeholderSatisfaction: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKPIData()
  }, [timeframe])

  const fetchKPIData = async () => {
    try {
      // Fetch projects data for KPI calculations
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .gte('created_at', getTimeframeStart(timeframe))

      const { data: risks } = await supabase
        .from('project_risks')
        .select('*')
        .gte('created_at', getTimeframeStart(timeframe))

      // Calculate KPIs
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0
      const totalProjects = projects?.length || 1
      const totalBudget = projects?.reduce((sum, p) => sum + (p.budget || 0), 0)
      const avgProgress = projects?.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects
      
      const resolvedRisks = risks?.filter(r => r.status === 'resolved').length || 0
      const totalRisks = risks?.length || 1

      setKpiData({
        projectsCompleted: completedProjects,
        budgetUtilization: Math.round((avgProgress / 100) * 100),
        avgDeliveryTime: Math.round(Math.random() * 10 + 15), // Simulated
        teamProductivity: Math.round(avgProgress * 1.2),
        riskMitigationRate: Math.round((resolvedRisks / totalRisks) * 100),
        stakeholderSatisfaction: Math.round(Math.random() * 20 + 75) // Simulated
      })

    } catch (error) {
      console.error('Error fetching KPI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeframeStart = (timeframe: string) => {
    const now = new Date()
    switch (timeframe) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  }

  const getKPIColor = (value: number, target: number = 80) => {
    if (value >= target) return 'text-success'
    if (value >= target * 0.8) return 'text-warning'
    return 'text-destructive'
  }

  const getProgressColor = (value: number, target: number = 80) => {
    if (value >= target) return 'bg-success'
    if (value >= target * 0.8) return 'bg-warning'
    return 'bg-destructive'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="airbus-card">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-airbus-blue">Performance KPIs</h3>
          <p className="text-muted-foreground">Key performance indicators for the {timeframe}</p>
        </div>
        <Badge variant="outline" className="capitalize">{timeframe}ly View</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Completed */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects Completed</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.projectsCompleted}</p>
              </div>
              <Target className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: 5</span>
                <span className={getKPIColor(kpiData.projectsCompleted, 5)}>
                  {kpiData.projectsCompleted >= 5 ? '✓' : `${5 - kpiData.projectsCompleted} remaining`}
                </span>
              </div>
              <Progress 
                value={(kpiData.projectsCompleted / 5) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.budgetUtilization}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: 80%</span>
                <span className={getKPIColor(kpiData.budgetUtilization, 80)}>
                  {kpiData.budgetUtilization >= 80 ? 'On Track' : 'Under Utilized'}
                </span>
              </div>
              <Progress 
                value={kpiData.budgetUtilization} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Avg Delivery Time */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Delivery Time</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.avgDeliveryTime} days</p>
              </div>
              <Clock className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: ≤20 days</span>
                <span className={getKPIColor(20 - kpiData.avgDeliveryTime + 20, 20)}>
                  {kpiData.avgDeliveryTime <= 20 ? 'Excellent' : 'Needs Improvement'}
                </span>
              </div>
              <Progress 
                value={Math.max(0, 100 - (kpiData.avgDeliveryTime - 10) * 5)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Productivity</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.teamProductivity}%</p>
              </div>
              <Users className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: 85%</span>
                <span className={getKPIColor(kpiData.teamProductivity, 85)}>
                  {kpiData.teamProductivity >= 85 ? 'High Performance' : 'Room for Growth'}
                </span>
              </div>
              <Progress 
                value={kpiData.teamProductivity} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Mitigation Rate */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Mitigation</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.riskMitigationRate}%</p>
              </div>
              <Activity className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: 90%</span>
                <span className={getKPIColor(kpiData.riskMitigationRate, 90)}>
                  {kpiData.riskMitigationRate >= 90 ? 'Excellent' : 'Action Required'}
                </span>
              </div>
              <Progress 
                value={kpiData.riskMitigationRate} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder Satisfaction */}
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stakeholder Satisfaction</p>
                <p className="text-3xl font-bold text-airbus-blue">{kpiData.stakeholderSatisfaction}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Target: 85%</span>
                <span className={getKPIColor(kpiData.stakeholderSatisfaction, 85)}>
                  {kpiData.stakeholderSatisfaction >= 85 ? 'Satisfied' : 'Needs Attention'}
                </span>
              </div>
              <Progress 
                value={kpiData.stakeholderSatisfaction} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PerformanceDashboard