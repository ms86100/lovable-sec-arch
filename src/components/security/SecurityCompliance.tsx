import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Shield, CalendarIcon, AlertTriangle, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface SecurityCompliance {
  id?: string
  data_compliance_last_assessment?: string
  export_control_status?: string
  created_at?: string
  updated_at?: string
}

interface SecurityComplianceProps {
  projectId: string
  projectName: string
  readOnly?: boolean
}

export function SecurityCompliance({ projectId, projectName, readOnly = false }: SecurityComplianceProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [compliance, setCompliance] = useState<SecurityCompliance | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    data_compliance_last_assessment: undefined as Date | undefined,
    export_control_status: ''
  })

  useEffect(() => {
    fetchComplianceData()
  }, [projectId])

  const fetchComplianceData = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('project_security_compliance')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle()

      if (error) throw error

      setCompliance(data)
      
      if (data) {
        setFormData({
          data_compliance_last_assessment: data.data_compliance_last_assessment 
            ? new Date(data.data_compliance_last_assessment) 
            : undefined,
          export_control_status: data.export_control_status || ''
        })
      }
    } catch (error: any) {
      console.error('Error fetching compliance data:', error)
      toast({
        title: "Error",
        description: "Failed to load security compliance data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (readOnly) return

    try {
      setSaving(true)

      const complianceData = {
        project_id: projectId,
        data_compliance_last_assessment: formData.data_compliance_last_assessment 
          ? format(formData.data_compliance_last_assessment, 'yyyy-MM-dd') 
          : null,
        export_control_status: formData.export_control_status || null,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (compliance?.id) {
        // Update existing record
        const { error } = await supabase
          .from('project_security_compliance')
          .update(complianceData)
          .eq('id', compliance.id)

        if (error) throw error
      } else {
        // Create new record
        const { error } = await supabase
          .from('project_security_compliance')
          .insert(complianceData)

        if (error) throw error
      }

      toast({
        title: "Success",
        description: "Security compliance updated successfully"
      })

      fetchComplianceData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const getExportControlColor = (status: string) => {
    switch (status) {
      case 'export_controlled':
      case 'military':
        return 'destructive'
      case 'dual_use':
        return 'default'
      case 'controlled_other':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getComplianceStatus = () => {
    if (!compliance) return { status: 'pending', message: 'Not assessed', icon: AlertTriangle, color: 'text-yellow-600' }
    
    const hasAssessment = !!compliance.data_compliance_last_assessment
    const hasExportControl = !!compliance.export_control_status
    
    if (hasAssessment && hasExportControl) {
      return { status: 'complete', message: 'Compliant', icon: CheckCircle, color: 'text-green-600' }
    } else {
      return { status: 'partial', message: 'Partially assessed', icon: AlertTriangle, color: 'text-yellow-600' }
    }
  }

  const complianceStatus = getComplianceStatus()
  const StatusIcon = complianceStatus.icon

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security & Compliance</h2>
          <p className="text-muted-foreground">Manage security assessments and compliance status for {projectName}</p>
        </div>
        
        {!readOnly && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-6 w-6 ${complianceStatus.color}`} />
            <div>
              <span className={`font-medium ${complianceStatus.color}`}>
                {complianceStatus.message}
              </span>
              {compliance?.updated_at && (
                <p className="text-sm text-muted-foreground">
                  Last updated: {format(new Date(compliance.updated_at), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Compliance Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Data Compliance Assessment</CardTitle>
            <CardDescription>
              Track the last data compliance assessment date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Last Assessment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.data_compliance_last_assessment && "text-muted-foreground"
                    )}
                    disabled={readOnly}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data_compliance_last_assessment 
                      ? format(formData.data_compliance_last_assessment, 'PPP') 
                      : 'Pick a date'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.data_compliance_last_assessment}
                    onSelect={(date) => setFormData({
                      ...formData, 
                      data_compliance_last_assessment: date
                    })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {formData.data_compliance_last_assessment && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Assessment completed on {format(formData.data_compliance_last_assessment, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Control Status */}
        <Card>
          <CardHeader>
            <CardTitle>Export Control Status</CardTitle>
            <CardDescription>
              Define the export control classification for this project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export_control_status">Export Control Classification</Label>
              <Select 
                value={formData.export_control_status} 
                onValueChange={(value) => setFormData({...formData, export_control_status: value})}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export_controlled">Export Controlled</SelectItem>
                  <SelectItem value="dual_use">Dual Use</SelectItem>
                  <SelectItem value="military">Military</SelectItem>
                  <SelectItem value="controlled_other">Controlled Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.export_control_status && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Classification:</span>
                  <span className={`text-sm px-2 py-1 rounded text-white ${
                    formData.export_control_status === 'export_controlled' || formData.export_control_status === 'military' 
                      ? 'bg-red-600' 
                      : formData.export_control_status === 'dual_use' 
                      ? 'bg-blue-600' 
                      : 'bg-gray-600'
                  }`}>
                    {formData.export_control_status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                {(formData.export_control_status === 'export_controlled' || 
                  formData.export_control_status === 'military') && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>High security classification - additional controls may be required</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compliance Summary */}
      {compliance && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Summary</CardTitle>
            <CardDescription>
              Overview of current compliance status and requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Compliance Assessment</span>
                  <div className="flex items-center gap-2">
                    {compliance.data_compliance_last_assessment ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Completed</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Export Control Classification</span>
                  <div className="flex items-center gap-2">
                    {compliance.export_control_status ? (
                      <>
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Classified</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-600">Not Set</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Next Actions</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {!compliance.data_compliance_last_assessment && (
                    <div>• Schedule data compliance assessment</div>
                  )}
                  {!compliance.export_control_status && (
                    <div>• Determine export control classification</div>
                  )}
                  {compliance.data_compliance_last_assessment && compliance.export_control_status && (
                    <div className="text-green-600">✓ All compliance requirements addressed</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}