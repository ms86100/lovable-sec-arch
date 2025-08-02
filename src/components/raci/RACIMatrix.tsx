import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserCheck, Eye, MessageCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface Stakeholder {
  id: string
  name: string
  email: string
  role: string
  raci_role: string
  influence_level: string
  project_id: string
  projects: {
    name: string
  }
}

interface RACIData {
  projectName: string
  stakeholders: {
    responsible: Stakeholder[]
    accountable: Stakeholder[]
    consulted: Stakeholder[]
    informed: Stakeholder[]
  }
}

interface RACIMatrixProps {
  projectId?: string
  showAllProjects?: boolean
}

export function RACIMatrix({ projectId, showAllProjects = false }: RACIMatrixProps) {
  const [raciData, setRaciData] = useState<RACIData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRACIData()
  }, [projectId])

  const fetchRACIData = async () => {
    try {
      let query = supabase
        .from('project_stakeholders')
        .select(`
          *,
          projects!inner (name)
        `)
        .not('raci_role', 'is', null)

      if (projectId && !showAllProjects) {
        query = query.eq('project_id', projectId)
      }

      const { data: stakeholdersData, error } = await query

      if (error) throw error

      if (showAllProjects) {
        // Group by project
        const projectGroups = stakeholdersData?.reduce((acc, stakeholder) => {
          const projectName = stakeholder.projects.name
          if (!acc[projectName]) {
            acc[projectName] = {
              projectName,
              stakeholders: {
                responsible: [],
                accountable: [],
                consulted: [],
                informed: []
              }
            }
          }
          
          const raciRole = stakeholder.raci_role.toLowerCase()
          if (raciRole in acc[projectName].stakeholders) {
            acc[projectName].stakeholders[raciRole as keyof typeof acc[typeof projectName]['stakeholders']].push(stakeholder)
          }
          
          return acc
        }, {} as Record<string, RACIData>)

        setRaciData(Object.values(projectGroups || {}))
      } else {
        // Single project view
        const groupedStakeholders = stakeholdersData?.reduce((acc, stakeholder) => {
          const raciRole = stakeholder.raci_role.toLowerCase()
          if (raciRole in acc) {
            acc[raciRole as keyof typeof acc].push(stakeholder)
          }
          return acc
        }, {
          responsible: [] as Stakeholder[],
          accountable: [] as Stakeholder[],
          consulted: [] as Stakeholder[],
          informed: [] as Stakeholder[]
        })

        setRaciData([{
          projectName: stakeholdersData?.[0]?.projects.name || 'Project',
          stakeholders: groupedStakeholders || {
            responsible: [],
            accountable: [],
            consulted: [],
            informed: []
          }
        }])
      }

    } catch (error) {
      console.error('Error fetching RACI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRACIIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'responsible': return <UserCheck className="w-4 h-4" />
      case 'accountable': return <CheckCircle className="w-4 h-4" />
      case 'consulted': return <MessageCircle className="w-4 h-4" />
      case 'informed': return <Eye className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getRACIColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'responsible': return 'bg-success text-success-foreground'
      case 'accountable': return 'bg-primary text-primary-foreground'
      case 'consulted': return 'bg-warning text-warning-foreground'
      case 'informed': return 'bg-info text-info-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'high': return 'border-l-destructive'
      case 'medium': return 'border-l-warning'
      case 'low': return 'border-l-success'
      default: return 'border-l-muted'
    }
  }

  if (loading) {
    return (
      <Card className="airbus-card">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {raciData.map((projectData, projectIndex) => (
        <Card key={projectIndex} className="airbus-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-airbus-blue" />
              RACI Matrix
              {showAllProjects && (
                <Badge variant="outline" className="ml-2">
                  {projectData.projectName}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Responsibility Assignment Matrix for stakeholder roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Responsible */}
              <Card className="border-l-4 border-l-success">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getRACIIcon('responsible')}
                    Responsible
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Who does the work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.stakeholders.responsible.map((stakeholder) => (
                    <div
                      key={stakeholder.id}
                      className={`p-2 rounded border-l-2 ${getInfluenceColor(stakeholder.influence_level)} bg-muted/50`}
                    >
                      <div className="font-medium text-sm">{stakeholder.name}</div>
                      <div className="text-xs text-muted-foreground">{stakeholder.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stakeholder.influence_level} influence
                      </Badge>
                    </div>
                  ))}
                  {projectData.stakeholders.responsible.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No one assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Accountable */}
              <Card className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getRACIIcon('accountable')}
                    Accountable
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Signs off the work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.stakeholders.accountable.map((stakeholder) => (
                    <div
                      key={stakeholder.id}
                      className={`p-2 rounded border-l-2 ${getInfluenceColor(stakeholder.influence_level)} bg-muted/50`}
                    >
                      <div className="font-medium text-sm">{stakeholder.name}</div>
                      <div className="text-xs text-muted-foreground">{stakeholder.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stakeholder.influence_level} influence
                      </Badge>
                    </div>
                  ))}
                  {projectData.stakeholders.accountable.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No one assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Consulted */}
              <Card className="border-l-4 border-l-warning">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getRACIIcon('consulted')}
                    Consulted
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Provides input
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.stakeholders.consulted.map((stakeholder) => (
                    <div
                      key={stakeholder.id}
                      className={`p-2 rounded border-l-2 ${getInfluenceColor(stakeholder.influence_level)} bg-muted/50`}
                    >
                      <div className="font-medium text-sm">{stakeholder.name}</div>
                      <div className="text-xs text-muted-foreground">{stakeholder.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stakeholder.influence_level} influence
                      </Badge>
                    </div>
                  ))}
                  {projectData.stakeholders.consulted.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No one assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Informed */}
              <Card className="border-l-4 border-l-info">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {getRACIIcon('informed')}
                    Informed
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Kept updated
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projectData.stakeholders.informed.map((stakeholder) => (
                    <div
                      key={stakeholder.id}
                      className={`p-2 rounded border-l-2 ${getInfluenceColor(stakeholder.influence_level)} bg-muted/50`}
                    >
                      <div className="font-medium text-sm">{stakeholder.name}</div>
                      <div className="text-xs text-muted-foreground">{stakeholder.role}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {stakeholder.influence_level} influence
                      </Badge>
                    </div>
                  ))}
                  {projectData.stakeholders.informed.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No one assigned</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {Object.values(projectData.stakeholders).every(group => group.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No RACI assignments found</p>
                <p className="text-sm">Add stakeholders with RACI roles to see the matrix</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default RACIMatrix