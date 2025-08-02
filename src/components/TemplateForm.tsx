import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Template {
  id?: string
  name: string
  description: string
  is_public: boolean
}

interface TemplateFormProps {
  template?: Template
  onSuccess: () => void
  onCancel: () => void
}

export function TemplateForm({ template, onSuccess, onCancel }: TemplateFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Template>({
    name: template?.name || '',
    description: template?.description || '',
    is_public: template?.is_public || false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const templateData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public,
        updated_by: user.id
      }

      let error
      if (template?.id) {
        const { error: updateError } = await supabase
          .from('project_templates')
          .update(templateData)
          .eq('id', template.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('project_templates')
          .insert({
            ...templateData,
            created_by: user.id
          })
        error = insertError
      }

      if (error) throw error

      toast({
        title: template?.id ? "Template Updated" : "Template Created",
        description: `${formData.name} has been ${template?.id ? 'updated' : 'created'} successfully.`
      })
      
      onSuccess()
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

  return (
    <div className="p-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{template?.id ? 'Edit Template' : 'Create Template'}</CardTitle>
          <CardDescription>
            Templates define the structure and custom fields for projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Product Development"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template is for..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: !!checked }))}
              />
              <Label htmlFor="is_public">Make this template public</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !formData.name.trim()}>
                {loading ? 'Saving...' : (template?.id ? 'Update Template' : 'Create Template')}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}