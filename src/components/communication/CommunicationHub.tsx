import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Mail, 
  Calendar, 
  Clock,
  Users,
  Plus,
  Send,
  Bell,
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  Settings
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface CommunicationLog {
  id: string
  projectId: string
  projectName: string
  type: 'meeting' | 'email' | 'call' | 'decision' | 'escalation' | 'announcement'
  subject: string
  content: string
  participants: string[]
  timestamp: string
  createdBy: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'draft' | 'sent' | 'acknowledged' | 'action_required'
  followUpDate?: string
  attachments?: string[]
}

interface Notification {
  id: string
  type: 'communication' | 'deadline' | 'budget' | 'risk' | 'milestone'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

export function CommunicationHub() {
  const { user } = useAuth()
  const [communications, setCommunications] = useState<CommunicationLog[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterProject, setFilterProject] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isNewLogOpen, setIsNewLogOpen] = useState(false)

  useEffect(() => {
    fetchCommunicationData()
  }, [])

  const fetchCommunicationData = async () => {
    try {
      // Fetch projects for filter
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name')

      // Mock communication logs (in real app, this would be a dedicated table)
      const mockCommunications: CommunicationLog[] = [
        {
          id: '1',
          projectId: 'proj1',
          projectName: 'Alpha Digital Transformation',
          type: 'meeting',
          subject: 'Weekly Sprint Review - Week 12',
          content: 'Discussed current sprint progress, identified blockers in API integration, and planned next sprint activities. Key decisions: Moving to microservices architecture, extending timeline by 1 week.',
          participants: ['sarah.johnson@company.com', 'michael.chen@company.com', 'david.kim@company.com'],
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdBy: 'michael.chen@company.com',
          priority: 'medium',
          status: 'acknowledged',
          followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          projectId: 'proj2',
          projectName: 'Beta Cloud Migration',
          type: 'escalation',
          subject: 'URGENT: Budget Variance Alert - 15% Over',
          content: 'Project is currently 15% over budget due to unexpected infrastructure costs. Immediate action required to reassess scope or secure additional funding.',
          participants: ['emily.rodriguez@company.com', 'lisa.wang@company.com'],
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          createdBy: 'emily.rodriguez@company.com',
          priority: 'urgent',
          status: 'action_required',
          followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          projectId: 'proj1',
          projectName: 'Alpha Digital Transformation',
          type: 'decision',
          subject: 'Architecture Decision: Database Selection',
          content: 'After technical evaluation, team decided to use PostgreSQL over MongoDB for better ACID compliance and complex query support. Migration plan approved.',
          participants: ['sarah.johnson@company.com', 'david.kim@company.com'],
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'sarah.johnson@company.com',
          priority: 'high',
          status: 'acknowledged'
        },
        {
          id: '4',
          projectId: 'proj3',
          projectName: 'Gamma Security Enhancement',
          type: 'announcement',
          subject: 'Security Audit Completed - All Clear',
          content: 'External security audit completed successfully with no critical findings. Minor recommendations documented for future implementation.',
          participants: ['all-team@company.com'],
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          createdBy: 'lisa.wang@company.com',
          priority: 'medium',
          status: 'sent'
        }
      ]

      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'deadline',
          title: 'Project Milestone Due Tomorrow',
          message: 'Alpha Digital Transformation - Phase 2 delivery is due tomorrow',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/projects/proj1'
        },
        {
          id: '2',
          type: 'budget',
          title: 'Budget Alert',
          message: 'Beta Cloud Migration is 15% over budget',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          actionUrl: '/projects/proj2'
        },
        {
          id: '3',
          type: 'communication',
          title: 'New Communication Log',
          message: 'Michael Chen added a new meeting log for Alpha project',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'medium'
        }
      ]

      setCommunications(mockCommunications)
      setNotifications(mockNotifications)

    } catch (error) {
      console.error('Error fetching communication data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'call': return <Phone className="w-4 h-4" />
      case 'decision': return <CheckCircle className="w-4 h-4" />
      case 'escalation': return <AlertTriangle className="w-4 h-4" />
      case 'announcement': return <Bell className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'text-airbus-blue'
      case 'email': return 'text-info'
      case 'call': return 'text-success'
      case 'decision': return 'text-primary'
      case 'escalation': return 'text-destructive'
      case 'announcement': return 'text-warning'
      default: return 'text-muted-foreground'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'outline'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'action_required': return 'text-destructive'
      case 'acknowledged': return 'text-success'
      case 'sent': return 'text-airbus-blue'
      case 'draft': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  const filteredCommunications = communications.filter(comm => {
    const matchesType = filterType === 'all' || comm.type === filterType
    const matchesProject = filterProject === 'all' || comm.projectId === filterProject
    const matchesSearch = searchTerm === '' || 
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesProject && matchesSearch
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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

  const unreadNotifications = notifications.filter(n => !n.read).length
  const urgentCommunications = communications.filter(c => c.priority === 'urgent').length
  const pendingActions = communications.filter(c => c.status === 'action_required').length

  return (
    <div className="space-y-6">
      {/* Communication Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Communications</p>
                <p className="text-3xl font-bold text-airbus-blue">{communications.length}</p>
                <p className="text-xs text-muted-foreground mt-1">This period</p>
              </div>
              <MessageSquare className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-3xl font-bold text-warning">{unreadNotifications}</p>
                <p className="text-xs text-muted-foreground mt-1">Unread</p>
              </div>
              <Bell className="h-8 w-8 text-warning group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent Items</p>
                <p className="text-3xl font-bold text-destructive">{urgentCommunications}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                <p className="text-3xl font-bold text-info">{pendingActions}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
              </div>
              <Clock className="h-8 w-8 text-info group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="communications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="communications">Communication Logs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="communications" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-airbus-blue">Communication Hub</h3>
              <p className="text-muted-foreground">Centralized communication logs and stakeholder interactions</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="decision">Decision</SelectItem>
                  <SelectItem value="escalation">Escalation</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isNewLogOpen} onOpenChange={setIsNewLogOpen}>
                <DialogTrigger asChild>
                  <Button className="airbus-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Log
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>New Communication Log</DialogTitle>
                    <DialogDescription>
                      Record important communications, decisions, and escalations
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="log-type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="call">Call</SelectItem>
                            <SelectItem value="decision">Decision</SelectItem>
                            <SelectItem value="escalation">Escalation</SelectItem>
                            <SelectItem value="announcement">Announcement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="log-priority">Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="log-subject">Subject</Label>
                      <Input id="log-subject" placeholder="Communication subject" />
                    </div>
                    <div>
                      <Label htmlFor="log-content">Content</Label>
                      <Textarea 
                        id="log-content" 
                        placeholder="Detailed description of the communication..." 
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="log-participants">Participants</Label>
                      <Input id="log-participants" placeholder="email1@company.com, email2@company.com" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewLogOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="airbus-button-primary">
                        <Send className="w-4 h-4 mr-2" />
                        Save Log
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Communication Logs */}
          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <Card key={comm.id} className="airbus-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-muted/30 ${getTypeColor(comm.type)}`}>
                        {getTypeIcon(comm.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{comm.subject}</CardTitle>
                          <Badge variant={getPriorityBadge(comm.priority)} className="capitalize">
                            {comm.priority}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(comm.status)}>
                            {comm.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{comm.projectName}</span>
                          <span>•</span>
                          <span>{new Date(comm.timestamp).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{comm.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {comm.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created by: {comm.createdBy}</span>
                      {comm.followUpDate && (
                        <>
                          <span>•</span>
                          <span>Follow-up: {new Date(comm.followUpDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {comm.status === 'action_required' && (
                        <Button size="sm" className="airbus-button-primary">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-airbus-blue" />
                Real-Time Notifications
              </CardTitle>
              <CardDescription>
                Stay updated with project changes, deadlines, and important events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'border-l-4 border-l-airbus-blue bg-airbus-blue/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-airbus-blue rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="capitalize">
                            {notification.type}
                          </Badge>
                          <span>•</span>
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-airbus-blue" />
                Communication Tool Integrations
              </CardTitle>
              <CardDescription>
                Connect with Slack, Teams, email, and other communication platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Integrations Coming Soon</h3>
                <p className="text-sm mb-4">
                  Connect with Slack, Microsoft Teams, email platforms, and more
                </p>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Integrations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CommunicationHub