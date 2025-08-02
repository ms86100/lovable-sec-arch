import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  UserCheck, 
  Users,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  Settings,
  Activity,
  Search,
  Filter,
  FileText,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resourceType: 'project' | 'document' | 'user' | 'system'
  resourceId: string
  resourceName: string
  details: string
  ipAddress: string
  userAgent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  category: 'access' | 'data' | 'authentication' | 'compliance'
  enabled: boolean
  level: 'basic' | 'enhanced' | 'strict'
  lastUpdated: string
  affectedUsers: number
}

interface AccessControl {
  resourceId: string
  resourceName: string
  resourceType: 'project' | 'document' | 'folder'
  owner: string
  permissions: {
    userId: string
    userName: string
    role: string
    access: 'read' | 'write' | 'admin'
    inherited: boolean
    grantedBy: string
    grantedAt: string
  }[]
}

export function SecurityCenter() {
  const { user, hasRole } = useAuth()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([])
  const [accessControls, setAccessControls] = useState<AccessControl[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const isAdmin = hasRole('admin')

  useEffect(() => {
    if (isAdmin) {
      fetchSecurityData()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const fetchSecurityData = async () => {
    try {
      // Mock audit logs (in real app, this would be a dedicated audit table)
      const mockAuditLogs: AuditLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          userId: 'user1',
          userName: 'Sarah Johnson',
          action: 'Document Downloaded',
          resourceType: 'document',
          resourceId: 'doc1',
          resourceName: 'Alpha Project - Technical Architecture v2.1.pdf',
          details: 'Downloaded confidential technical document',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'medium'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          userId: 'user2',
          userName: 'Michael Chen',
          action: 'Failed Login Attempt',
          resourceType: 'system',
          resourceId: 'auth',
          resourceName: 'Authentication System',
          details: 'Multiple failed login attempts detected',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
          severity: 'high'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          userId: 'user3',
          userName: 'Emily Rodriguez',
          action: 'Project Access Granted',
          resourceType: 'project',
          resourceId: 'proj2',
          resourceName: 'Beta Cloud Migration',
          details: 'Granted admin access to restricted project',
          ipAddress: '172.16.0.25',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          severity: 'medium'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          userId: 'user4',
          userName: 'David Kim',
          action: 'Sensitive Data Export',
          resourceType: 'document',
          resourceId: 'doc3',
          resourceName: 'Security Audit Report - Q4 2023.pdf',
          details: 'Exported confidential security audit report',
          ipAddress: '192.168.1.75',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'critical'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          userId: 'admin1',
          userName: 'System Administrator',
          action: 'Security Policy Updated',
          resourceType: 'system',
          resourceId: 'policy1',
          resourceName: 'Document Access Policy',
          details: 'Updated document access restrictions',
          ipAddress: '10.0.0.10',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          severity: 'low'
        }
      ]

      const mockSecurityPolicies: SecurityPolicy[] = [
        {
          id: '1',
          name: 'Document Access Control',
          description: 'Controls access to sensitive documents based on user roles and classifications',
          category: 'access',
          enabled: true,
          level: 'enhanced',
          lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 45
        },
        {
          id: '2',
          name: 'Multi-Factor Authentication',
          description: 'Requires additional authentication factors for sensitive operations',
          category: 'authentication',
          enabled: true,
          level: 'strict',
          lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 52
        },
        {
          id: '3',
          name: 'Data Encryption at Rest',
          description: 'Encrypts all stored data using AES-256 encryption',
          category: 'data',
          enabled: true,
          level: 'enhanced',
          lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 0
        },
        {
          id: '4',
          name: 'GDPR Compliance',
          description: 'Ensures compliance with GDPR data protection regulations',
          category: 'compliance',
          enabled: true,
          level: 'strict',
          lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 52
        },
        {
          id: '5',
          name: 'Session Timeout',
          description: 'Automatically logs out users after period of inactivity',
          category: 'authentication',
          enabled: false,
          level: 'basic',
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          affectedUsers: 0
        }
      ]

      const mockAccessControls: AccessControl[] = [
        {
          resourceId: 'proj1',
          resourceName: 'Alpha Digital Transformation',
          resourceType: 'project',
          owner: 'sarah.johnson@company.com',
          permissions: [
            {
              userId: 'user1',
              userName: 'Sarah Johnson',
              role: 'Project Manager',
              access: 'admin',
              inherited: false,
              grantedBy: 'system',
              grantedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              userId: 'user2',
              userName: 'Michael Chen',
              role: 'Team Lead',
              access: 'write',
              inherited: true,
              grantedBy: 'sarah.johnson@company.com',
              grantedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              userId: 'user3',
              userName: 'David Kim',
              role: 'Developer',
              access: 'read',
              inherited: true,
              grantedBy: 'sarah.johnson@company.com',
              grantedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        }
      ]

      setAuditLogs(mockAuditLogs)
      setSecurityPolicies(mockSecurityPolicies)
      setAccessControls(mockAccessControls)

    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive'
      case 'high': return 'text-warning'
      case 'medium': return 'text-info'
      case 'low': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'outline'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'access': return <Lock className="w-4 h-4" />
      case 'data': return <Shield className="w-4 h-4" />
      case 'authentication': return <UserCheck className="w-4 h-4" />
      case 'compliance': return <FileText className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getAccessIcon = (access: string) => {
    switch (access) {
      case 'admin': return <Shield className="w-4 h-4 text-destructive" />
      case 'write': return <Edit className="w-4 h-4 text-warning" />
      case 'read': return <Eye className="w-4 h-4 text-success" />
      default: return <EyeOff className="w-4 h-4 text-muted-foreground" />
    }
  }

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity
    const matchesAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase())
    const matchesSearch = searchTerm === '' || 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSeverity && matchesAction && matchesSearch
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (!isAdmin) {
    return (
      <Card className="airbus-card">
        <CardContent className="p-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You need administrator privileges to access the Security Center
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalAuditLogs = auditLogs.length
  const criticalAlerts = auditLogs.filter(log => log.severity === 'critical').length
  const activePolicies = securityPolicies.filter(policy => policy.enabled).length
  const recentActivity = auditLogs.filter(log => 
    new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length

  return (
    <div className="space-y-6">
      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Audit Logs</p>
                <p className="text-3xl font-bold text-airbus-blue">{totalAuditLogs}</p>
                <p className="text-xs text-muted-foreground mt-1">Total events</p>
              </div>
              <Activity className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-3xl font-bold text-destructive">{criticalAlerts}</p>
                <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                <p className="text-3xl font-bold text-success">{activePolicies}</p>
                <p className="text-xs text-muted-foreground mt-1">Security policies</p>
              </div>
              <Shield className="h-8 w-8 text-success group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                <p className="text-3xl font-bold text-warning">{recentActivity}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <Clock className="h-8 w-8 text-warning group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-6">
        <TabsList>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-airbus-blue">Security Audit Trail</h3>
              <p className="text-muted-foreground">Complete log of all system activities and security events</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <Card className="airbus-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAuditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.userName}</p>
                          <p className="text-xs text-muted-foreground">{log.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">{log.details}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{log.resourceName}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {log.resourceType}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityBadge(log.severity)} className="capitalize">
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-airbus-blue">Security Policies</h3>
              <p className="text-muted-foreground">Configure and manage security policies</p>
            </div>
            <Button className="airbus-button-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Policy
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {securityPolicies.map((policy) => (
              <Card key={policy.id} className="airbus-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted/30 text-airbus-blue">
                        {getCategoryIcon(policy.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{policy.name}</CardTitle>
                        <CardDescription>{policy.description}</CardDescription>
                      </div>
                    </div>
                    <Switch checked={policy.enabled} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="capitalize">
                        {policy.category}
                      </Badge>
                      <Badge 
                        variant={policy.level === 'strict' ? 'destructive' : 
                               policy.level === 'enhanced' ? 'outline' : 'secondary'}
                        className="capitalize"
                      >
                        {policy.level}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {policy.affectedUsers} users affected
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-airbus-blue">Access Control Management</h3>
            <p className="text-muted-foreground">Manage user permissions and resource access</p>
          </div>

          {accessControls.map((resource) => (
            <Card key={resource.resourceId} className="airbus-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{resource.resourceName}</CardTitle>
                    <CardDescription>
                      {resource.resourceType} • Owner: {resource.owner}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Permission
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Inherited</TableHead>
                      <TableHead>Granted By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resource.permissions.map((permission, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{permission.userName}</p>
                            <p className="text-xs text-muted-foreground">{permission.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{permission.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAccessIcon(permission.access)}
                            <span className="capitalize">{permission.access}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {permission.inherited ? (
                            <Badge variant="secondary">Inherited</Badge>
                          ) : (
                            <Badge variant="outline">Direct</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {permission.grantedBy}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-airbus-blue" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Configure system-wide security settings and compliance options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Advanced Security Settings</h3>
                <p className="text-sm mb-4">
                  This section will include detailed security configuration options
                </p>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Configure Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SecurityCenter