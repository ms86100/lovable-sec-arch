import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileText, Plus, CalendarIcon, Edit, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface Document {
  id: string
  document_name: string
  document_url: string | null
  last_updated_date: string
  created_at: string
  updated_at: string
}

interface ProjectDocumentationProps {
  projectId: string
  projectName: string
  readOnly?: boolean
}

export function ProjectDocumentation({ projectId, projectName, readOnly = false }: ProjectDocumentationProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const [documentEntries, setDocumentEntries] = useState([
    { document_name: '', document_url: '' }
  ])

  useEffect(() => {
    fetchDocuments()
  }, [projectId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('project_documentation')
        .select('*')
        .eq('project_id', projectId)
        .order('last_updated_date', { ascending: false })

      if (error) throw error

      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      toast({
        title: "Error",
        description: "Failed to load project documentation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDocumentEntries([{ document_name: '', document_url: '' }])
    setEditingDocument(null)
  }

  const addDocumentEntry = () => {
    setDocumentEntries([...documentEntries, { document_name: '', document_url: '' }])
  }

  const removeDocumentEntry = (index: number) => {
    if (documentEntries.length > 1) {
      setDocumentEntries(documentEntries.filter((_, i) => i !== index))
    }
  }

  const updateDocumentEntry = (index: number, field: string, value: string) => {
    const updated = documentEntries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    )
    setDocumentEntries(updated)
  }

  const openEditDialog = (document: Document) => {
    setEditingDocument(document)
    setDocumentEntries([{
      document_name: document.document_name,
      document_url: document.document_url || ''
    }])
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all entries
    const validEntries = documentEntries.filter(entry => 
      entry.document_name.trim() && entry.document_url.trim()
    )

    if (validEntries.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one document with both name and URL",
        variant: "destructive"
      })
      return
    }

    try {
      if (editingDocument) {
        // Update existing document
        const documentData = {
          document_name: validEntries[0].document_name,
          document_url: validEntries[0].document_url,
          last_updated_date: format(new Date(), 'yyyy-MM-dd'),
          updated_by: user?.id
        }

        const { error } = await supabase
          .from('project_documentation')
          .update(documentData)
          .eq('id', editingDocument.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Document updated successfully"
        })
      } else {
        // Insert new documents
        const documentsToInsert = validEntries.map(entry => ({
          project_id: projectId,
          document_name: entry.document_name,
          document_url: entry.document_url,
          last_updated_date: format(new Date(), 'yyyy-MM-dd'),
          created_by: user?.id,
          updated_by: user?.id
        }))

        const { error } = await supabase
          .from('project_documentation')
          .insert(documentsToInsert)

        if (error) throw error

        toast({
          title: "Success",
          description: `${validEntries.length} document(s) added successfully`
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchDocuments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document entry?')) return

    try {
      const { error } = await supabase
        .from('project_documentation')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Document deleted successfully"
      })

      fetchDocuments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const getDocumentAgeColor = (lastUpdated: string) => {
    const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceUpdate <= 30) return 'text-green-600'
    if (daysSinceUpdate <= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDocumentAgeBadge = (lastUpdated: string) => {
    const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceUpdate <= 30) return { text: 'Recent', variant: 'default' as const }
    if (daysSinceUpdate <= 90) return { text: 'Outdated', variant: 'secondary' as const }
    return { text: 'Stale', variant: 'destructive' as const }
  }

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
          <h2 className="text-2xl font-bold">Project Documentation</h2>
          <p className="text-muted-foreground">Track and manage project documentation for {projectName}</p>
        </div>
        
        {!readOnly && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingDocument ? 'Edit Document' : 'Add New Document'}
                </DialogTitle>
                <DialogDescription>
                  Track important project documents and their last update dates
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Documentation Entries</Label>
                    {!editingDocument && (
                      <Button type="button" variant="outline" size="sm" onClick={addDocumentEntry}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Entry
                      </Button>
                    )}
                  </div>
                  
                  {documentEntries.map((entry, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Document {index + 1}</span>
                        {!editingDocument && documentEntries.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeDocumentEntry(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`document_name_${index}`}>Document Name *</Label>
                        <Input
                          id={`document_name_${index}`}
                          value={entry.document_name}
                          onChange={(e) => updateDocumentEntry(index, 'document_name', e.target.value)}
                          placeholder="e.g., Requirements Document, Design Specification"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`document_url_${index}`}>Document URL *</Label>
                        <Input
                          id={`document_url_${index}`}
                          type="url"
                          value={entry.document_url}
                          onChange={(e) => updateDocumentEntry(index, 'document_url', e.target.value)}
                          placeholder="https://example.com/document.pdf"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDocument ? 'Update' : 'Add'} Document{documentEntries.length > 1 ? 's' : ''}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Registry</CardTitle>
          <CardDescription>
            All project documents and their update status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No documents tracked</p>
              <p className="text-sm">Add documents to track their update status</p>
              {!readOnly && (
                <Button className="mt-4" onClick={() => { resetForm(); setDialogOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Document
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => {
                const ageBadge = getDocumentAgeBadge(document.last_updated_date)
                const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(document.last_updated_date).getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          {document.document_url ? (
                            <a 
                              href={document.document_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-primary hover:underline flex items-center gap-1"
                            >
                              {document.document_name}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <h4 className="font-medium">{document.document_name}</h4>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            ageBadge.variant === 'default' ? 'bg-green-100 text-green-800' :
                            ageBadge.variant === 'secondary' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {ageBadge.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className={getDocumentAgeColor(document.last_updated_date)}>
                            Last updated: {format(new Date(document.last_updated_date), 'MMM dd, yyyy')}
                          </span>
                          <span>
                            ({daysSinceUpdate} days ago)
                          </span>
                          <span>
                            Added: {format(new Date(document.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {!readOnly && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(document)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Statistics */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Documents</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {documents.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Recent (≤30 days)</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {documents.filter(doc => {
                  const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(doc.last_updated_date).getTime()) / (1000 * 60 * 60 * 24))
                  return daysSinceUpdate <= 30
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Stale (&gt;90 days)</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {documents.filter(doc => {
                  const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(doc.last_updated_date).getTime()) / (1000 * 60 * 60 * 24))
                  return daysSinceUpdate > 90
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}