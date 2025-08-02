import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit,
  Trash2,
  Lock,
  Unlock,
  History,
  Tag,
  Search,
  Filter,
  Plus,
  Share,
  Star,
  Clock,
  Settings
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface Document {
  id: string
  name: string
  type: string
  size: number
  projectId: string
  projectName: string
  categoryId: string
  categoryName: string
  version: string
  uploadedBy: string
  uploadedAt: string
  lastModified: string
  lastModifiedBy: string
  status: 'draft' | 'review' | 'approved' | 'archived'
  accessLevel: 'public' | 'team' | 'restricted' | 'confidential'
  tags: string[]
  downloadCount: number
  isStarred: boolean
  description?: string
}

interface DocumentCategory {
  id: string
  name: string
  description: string
  color: string
  documentCount: number
}

interface VersionHistory {
  version: string
  uploadedBy: string
  uploadedAt: string
  changeDescription: string
  fileSize: number
}

export function DocumentRepository() {
  const { user, hasRole } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'downloads'>('date')
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const canManageDocuments = hasRole('manager') || hasRole('admin')

  useEffect(() => {
    fetchDocumentData()
  }, [])

  const fetchDocumentData = async () => {
    try {
      // Fetch projects for filtering
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name')

      // Mock document categories
      const mockCategories: DocumentCategory[] = [
        {
          id: '1',
          name: 'Project Plans',
          description: 'Project planning documents and roadmaps',
          color: 'text-airbus-blue',
          documentCount: 15
        },
        {
          id: '2',
          name: 'Technical Specs',
          description: 'Technical specifications and architecture documents',
          color: 'text-success',
          documentCount: 23
        },
        {
          id: '3',
          name: 'Meeting Minutes',
          description: 'Meeting recordings and minutes',
          color: 'text-warning',
          documentCount: 34
        },
        {
          id: '4',
          name: 'Legal & Compliance',
          description: 'Legal documents and compliance reports',
          color: 'text-destructive',
          documentCount: 8
        },
        {
          id: '5',
          name: 'User Manuals',
          description: 'User guides and documentation',
          color: 'text-info',
          documentCount: 12
        }
      ]

      // Mock documents data
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'Alpha Project - Technical Architecture v2.1.pdf',
          type: 'pdf',
          size: 2547200, // 2.5MB
          projectId: 'proj1',
          projectName: 'Alpha Digital Transformation',
          categoryId: '2',
          categoryName: 'Technical Specs',
          version: '2.1',
          uploadedBy: 'sarah.johnson@company.com',
          uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastModifiedBy: 'david.kim@company.com',
          status: 'approved',
          accessLevel: 'team',
          tags: ['architecture', 'technical', 'approved'],
          downloadCount: 42,
          isStarred: true,
          description: 'Comprehensive technical architecture document for the Alpha project including system design, database schema, and API specifications.'
        },
        {
          id: '2',
          name: 'Beta Migration Plan - Phase 1.docx',
          type: 'docx',
          size: 1024000, // 1MB
          projectId: 'proj2',
          projectName: 'Beta Cloud Migration',
          categoryId: '1',
          categoryName: 'Project Plans',
          version: '1.0',
          uploadedBy: 'emily.rodriguez@company.com',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          lastModifiedBy: 'emily.rodriguez@company.com',
          status: 'review',
          accessLevel: 'restricted',
          tags: ['migration', 'planning', 'cloud'],
          downloadCount: 18,
          isStarred: false,
          description: 'Detailed migration plan for moving Beta system to cloud infrastructure.'
        },
        {
          id: '3',
          name: 'Security Audit Report - Q4 2023.pdf',
          type: 'pdf',
          size: 3145728, // 3MB
          projectId: 'proj3',
          projectName: 'Gamma Security Enhancement',
          categoryId: '4',
          categoryName: 'Legal & Compliance',
          version: '1.0',
          uploadedBy: 'lisa.wang@company.com',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastModifiedBy: 'lisa.wang@company.com',
          status: 'approved',
          accessLevel: 'confidential',
          tags: ['security', 'audit', 'compliance'],
          downloadCount: 8,
          isStarred: true,
          description: 'External security audit report with findings and recommendations.'
        },
        {
          id: '4',
          name: 'Weekly Sprint Meeting - Week 12.mp4',
          type: 'mp4',
          size: 15728640, // 15MB
          projectId: 'proj1',
          projectName: 'Alpha Digital Transformation',
          categoryId: '3',
          categoryName: 'Meeting Minutes',
          version: '1.0',
          uploadedBy: 'michael.chen@company.com',
          uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          lastModifiedBy: 'michael.chen@company.com',
          status: 'draft',
          accessLevel: 'team',
          tags: ['meeting', 'sprint', 'recording'],
          downloadCount: 5,
          isStarred: false,
          description: 'Sprint review meeting recording with team discussions and decisions.'
        }
      ]

      setCategories(mockCategories)
      setDocuments(mockDocuments)

    } catch (error) {
      console.error('Error fetching document data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return '📄'
      case 'docx':
      case 'doc': return '📝'
      case 'xlsx':
      case 'xls': return '📊'
      case 'pptx':
      case 'ppt': return '📋'
      case 'mp4':
      case 'avi': return '🎥'
      case 'mp3':
      case 'wav': return '🎵'
      case 'jpg':
      case 'png':
      case 'gif': return '🖼️'
      default: return '📁'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success'
      case 'review': return 'text-warning'
      case 'draft': return 'text-info'
      case 'archived': return 'text-muted-foreground'
      default: return 'text-muted-foreground'
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-success'
      case 'team': return 'text-airbus-blue'
      case 'restricted': return 'text-warning'
      case 'confidential': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'public': return <Unlock className="w-4 h-4" />
      case 'confidential': return <Lock className="w-4 h-4" />
      default: return <Eye className="w-4 h-4" />
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.categoryId === selectedCategory
    const matchesProject = selectedProject === 'all' || doc.projectId === selectedProject
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesProject && matchesSearch
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
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

  const totalDocuments = documents.length
  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
  const starredDocuments = documents.filter(doc => doc.isStarred).length
  const pendingReviews = documents.filter(doc => doc.status === 'review').length

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                <p className="text-3xl font-bold text-airbus-blue">{totalDocuments}</p>
                <p className="text-xs text-muted-foreground mt-1">All projects</p>
              </div>
              <FileText className="h-8 w-8 text-airbus-blue group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-3xl font-bold text-success">{formatFileSize(totalSize)}</p>
                <p className="text-xs text-muted-foreground mt-1">Total size</p>
              </div>
              <FolderOpen className="h-8 w-8 text-success group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Starred</p>
                <p className="text-3xl font-bold text-warning">{starredDocuments}</p>
                <p className="text-xs text-muted-foreground mt-1">Favorites</p>
              </div>
              <Star className="h-8 w-8 text-warning group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-info">{pendingReviews}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </div>
              <Clock className="h-8 w-8 text-info group-hover:animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Document Library</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="storage">Storage & Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-airbus-blue">Document Repository</h3>
              <p className="text-muted-foreground">Centralized document management with version control</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="size">Size</SelectItem>
                  <SelectItem value="downloads">Downloads</SelectItem>
                </SelectContent>
              </Select>
              {canManageDocuments && (
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button className="airbus-button-primary">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Document</DialogTitle>
                      <DialogDescription>
                        Add a new document to the repository
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="doc-category">Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="doc-access">Access Level</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="team">Team</SelectItem>
                              <SelectItem value="restricted">Restricted</SelectItem>
                              <SelectItem value="confidential">Confidential</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="doc-description">Description</Label>
                        <Input id="doc-description" placeholder="Document description" />
                      </div>
                      <div>
                        <Label htmlFor="doc-tags">Tags</Label>
                        <Input id="doc-tags" placeholder="tag1, tag2, tag3" />
                      </div>
                      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your files here, or click to browse
                        </p>
                        <Button variant="outline">Choose Files</Button>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="airbus-button-primary">
                          Upload Document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="airbus-card group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl">{getFileIcon(doc.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-lg truncate group-hover:text-airbus-blue transition-colors">
                            {doc.name}
                          </h4>
                          {doc.isStarred && <Star className="w-4 h-4 text-warning fill-current" />}
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                          <Badge variant="outline" className={getAccessLevelColor(doc.accessLevel)}>
                            <span className={getAccessLevelColor(doc.accessLevel)}>
                              {getAccessIcon(doc.accessLevel)}
                            </span>
                            <span className="ml-1 capitalize">{doc.accessLevel}</span>
                          </Badge>
                        </div>
                        
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {doc.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span>{doc.projectName}</span>
                          <span>•</span>
                          <span>{doc.categoryName}</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>•</span>
                          <span>v{doc.version}</span>
                          <span>•</span>
                          <span>{doc.downloadCount} downloads</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      {canManageDocuments && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <History className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      <span>Uploaded by {doc.uploadedBy} on {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span>Last modified by {doc.lastModifiedBy} on {new Date(doc.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="airbus-card group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-lg ${category.color}`}>
                      {category.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {category.documentCount} docs
                    </Badge>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage Usage</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Browse
                    </Button>
                    {canManageDocuments && (
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card className="airbus-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-airbus-blue" />
                Storage Management & Version Control
              </CardTitle>
              <CardDescription>
                Monitor storage usage and document version history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Advanced Storage Features Coming Soon</h3>
                <p className="text-sm mb-4">
                  This section will include detailed storage analytics and version history
                </p>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Storage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DocumentRepository