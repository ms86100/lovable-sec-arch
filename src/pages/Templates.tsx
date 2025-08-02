import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TemplateForm } from '@/components/TemplateForm'
import { TemplateFieldsManager } from '@/components/TemplateFieldsManager'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Template {
  id: string
  name: string
  description: string
  is_public: boolean
  created_by: string
  created_at: string
  field_count?: number
}

export default function Templates() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [managingFields, setManagingFields] = useState<string | null>(null)

  const fetchTemplates = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('project_templates')
        .select(`
          *,
          template_fields(count)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const templatesWithCount = data.map(template => ({
        ...template,
        field_count: template.template_fields?.[0]?.count || 0
      }))

      setTemplates(templatesWithCount)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [user])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('project_templates')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Template Deleted",
        description: "Template has been deleted successfully."
      })
      
      fetchTemplates()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTemplate(null)
    fetchTemplates()
  }

  const handleFieldsSuccess = () => {
    setManagingFields(null)
    fetchTemplates()
  }

  if (loading) {
    return <div className="p-6">Loading templates...</div>
  }

  if (managingFields) {
    return (
      <TemplateFieldsManager
        templateId={managingFields}
        onSuccess={handleFieldsSuccess}
        onCancel={() => setManagingFields(null)}
      />
    )
  }

  if (showForm || editingTemplate) {
    return (
      <TemplateForm
        template={editingTemplate}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false)
          setEditingTemplate(null)
        }}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Project Templates</h1>
          <p className="text-muted-foreground">
            Create reusable templates with custom fields for projects
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {template.description || 'No description'}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setManagingFields(template.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(template.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {template.is_public && (
                    <Badge variant="secondary">Public</Badge>
                  )}
                  <Badge variant="outline">
                    {template.field_count} field{template.field_count !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(template.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first project template to get started
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}