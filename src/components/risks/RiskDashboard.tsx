import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, TrendingUp, Shield, AlertCircle, Users, Clock } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'

interface Risk {
  id: string
  title: string
  description: string
  probability: string
  impact: string
  severity_level: string
  status: string
  risk_score: number
  project_id: string
  due_date: string
  assigned_to: string
  projects: {
    name: string
  }
}

interface RiskStats {
  totalRisks: number
  highRisks: number
  openRisks: number
  overdueMitigations: number
  avgRiskScore: number
}

interface RiskDashboardProps {
  projectId?: string
  showProjectNames?: boolean
}

export function RiskDashboard({ projectId, showProjectNames = false }: RiskDashboardProps) {
  const [risks, setRisks] = useState<Risk[]>([])
  const [stats, setStats] = useState<RiskStats>({
    totalRisks: 0,
    highRisks: 0,
    openRisks: 0,
    overdueMitigations: 0,
    avgRiskScore: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRiskData()
  }, [projectId])

  const fetchRiskData = async () => {
    try {
      let query = supabase
        .from('project_risks')
        .select(`
          *,
          projects!inner (name)
        `)
        .order('risk_score', { ascending: false })
        
      if (projectId) {
        query = query.eq('project_id', projectId)
      } else {
        query = query.limit(10)
      }
      
      const { data: risksData, error } = await query

      if (error) throw error

      setRisks(risksData || [])

      // Calculate stats
      const totalRisks = risksData?.length || 0
      const highRisks = risksData?.filter(r => r.severity_level === 'high').length || 0
      const openRisks = risksData?.filter(r => r.status === 'open').length || 0
      const overdueMitigations = risksData?.filter(r => 
        r.status === 'open' && r.due_date && new Date(r.due_date) < new Date()
      ).length || 0
      const avgRiskScore = totalRisks > 0 
        ? Math.round(risksData.reduce((sum, r) => sum + (r.risk_score || 0), 0) / totalRisks)
        : 0

      setStats({
        totalRisks,
        highRisks,
        openRisks,
        overdueMitigations,
        avgRiskScore
      })

    } catch (error) {
      console.error('Error fetching risk data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground'
      case 'medium': return 'bg-warning text-warning-foreground'
      case 'low': return 'bg-success text-success-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-destructive'
    if (score >= 60) return 'text-warning'
    if (score >= 40) return 'text-info'
    return 'text-success'
  }

  if (loading) {
    return (
      <Card className="airbus-card">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Risk Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-airbus-blue" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Risks</p>
                <p className="text-2xl font-bold">{stats.totalRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Severity</p>
                <p className="text-2xl font-bold text-destructive">{stats.highRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Risks</p>
                <p className="text-2xl font-bold text-warning">{stats.openRisks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-info" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-info">{stats.overdueMitigations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <p className={`text-2xl font-bold ${getRiskScoreColor(stats.avgRiskScore)}`}>
                  {stats.avgRiskScore}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Risks */}
      <Card className="airbus-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-airbus-blue" />
                Top Risk Items
              </CardTitle>
              <CardDescription>
                Highest priority risks requiring attention
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Risks
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.slice(0, 5).map((risk) => (
              <div
                key={risk.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${risk.project_id}?tab=risks`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{risk.title}</h4>
                      <Badge 
                        className={`text-xs ${getSeverityColor(risk.severity_level)}`}
                      >
                        {risk.severity_level.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {risk.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {showProjectNames && <span>Project: {risk.projects.name}</span>}
                      <span>Impact: {risk.impact}</span>
                      <span>Probability: {risk.probability}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRiskScoreColor(risk.risk_score || 0)}`}>
                      {risk.risk_score || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {risks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No risks found</p>
              <p className="text-sm">Create projects and add risks to see them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RiskDashboard