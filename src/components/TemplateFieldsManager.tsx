import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CustomFieldForm } from '@/components/CustomFieldForm'

interface CustomField {
  id: string
  name: string
  field_key: string
  field_type: string
  is_required: boolean
  default_value: string
  dropdown_options: string[]
  help_text: string
}

interface TemplateField {
  id: string
  custom_field_id: string
  template_default_value: string
  is_required_in_template: boolean
  field_order: number
  custom_fields: CustomField
}

interface TemplateFieldsManagerProps {
  templateId: string
  onSuccess: () => void
  onCancel: () => void
}

export function TemplateFieldsManager({ templateId, onSuccess, onCancel }: TemplateFieldsManagerProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [templateFields, setTemplateFields] = useState<TemplateField[]>([])
  const [availableFields, setAvailableFields] = useState<CustomField[]>([])
  const [selectedFieldId, setSelectedFieldId] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [showFieldForm, setShowFieldForm] = useState(false)

  const fetchData = async () => {
    if (!user) return

    try {
      // Fetch template details
      const { data: template, error: templateError } = await supabase
        .from('project_templates')
        .select('name')
        .eq('id', templateId)
        .single()

      if (templateError) throw templateError
      setTemplateName(template.name)

      // Fetch template fields
      const { data: fields, error: fieldsError } = await supabase
        .from('template_fields')
        .select(`
          *,
          custom_fields (*)
        `)
        .eq('template_id', templateId)
        .order('field_order')

      if (fieldsError) throw fieldsError
      setTemplateFields(fields || [])

      // Fetch available custom fields not in this template
      const usedFieldIds = fields?.map(f => f.custom_field_id) || []
      let availableQuery = supabase
        .from('custom_fields')
        .select('*')
      
      if (usedFieldIds.length > 0) {
        availableQuery = availableQuery.not('id', 'in', `(${usedFieldIds.join(',')})`)
      }
      
      const { data: available, error: availableError } = await availableQuery.order('name')

      if (availableError) throw availableError
      setAvailableFields(available || [])
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
    fetchData()
  }, [templateId, user])

  const handleAddField = async () => {
    if (!selectedFieldId) return

    try {
      const nextOrder = Math.max(...templateFields.map(f => f.field_order), 0) + 1
      
      const { error } = await supabase
        .from('template_fields')
        .insert({
          template_id: templateId,
          custom_field_id: selectedFieldId,
          field_order: nextOrder,
          is_required_in_template: false,
          template_default_value: null
        })

      if (error) throw error

      toast({
        title: "Field Added",
        description: "Field has been added to the template."
      })
      
      setSelectedFieldId('')
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleRemoveField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('template_fields')
        .delete()
        .eq('id', fieldId)

      if (error) throw error

      toast({
        title: "Field Removed",
        description: "Field has been removed from the template."
      })
      
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUpdateField = async (fieldId: string, updates: Partial<TemplateField>) => {
    try {
      const { error } = await supabase
        .from('template_fields')
        .update(updates)
        .eq('id', fieldId)

      if (error) throw error

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleMoveField = async (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = templateFields.findIndex(f => f.id === fieldId)
    if (currentIndex === -1) return
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= templateFields.length) return

    const currentField = templateFields[currentIndex]
    const targetField = templateFields[targetIndex]

    // Swap orders
    await Promise.all([
      handleUpdateField(currentField.id, { field_order: targetField.field_order }),
      handleUpdateField(targetField.id, { field_order: currentField.field_order })
    ])
  }

  if (loading) {
    return <div className="p-6">Loading template fields...</div>
  }

  if (showFieldForm) {
    return (
      <CustomFieldForm
        onSuccess={() => {
          setShowFieldForm(false)
          fetchData()
        }}
        onCancel={() => setShowFieldForm(false)}
      />
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Template Fields</h1>
          <p className="text-muted-foreground">
            Configure fields for "{templateName}" template
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFieldForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Field
          </Button>
          <Button onClick={onCancel} variant="outline">
            Done
          </Button>
        </div>
      </div>

      {/* Add field section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Field to Template</CardTitle>
          <CardDescription>
            Select an existing custom field to add to this template
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a field to add" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name} ({field.field_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddField} disabled={!selectedFieldId}>
              Add Field
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Template fields list */}
      <div className="space-y-4">
        {templateFields.map((templateField, index) => (
          <Card key={templateField.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{templateField.custom_fields.name}</h3>
                    <Badge variant="outline">{templateField.custom_fields.field_type}</Badge>
                    {templateField.is_required_in_template && (
                      <Badge variant="destructive">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {templateField.custom_fields.help_text || 'No help text'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`default-${templateField.id}`}>Template Default Value</Label>
                      <Input
                        id={`default-${templateField.id}`}
                        value={templateField.template_default_value || ''}
                        onChange={(e) => handleUpdateField(templateField.id, { 
                          template_default_value: e.target.value 
                        })}
                        placeholder="Optional default value for this template"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Field Options</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${templateField.id}`}
                          checked={templateField.is_required_in_template}
                          onCheckedChange={(checked) => handleUpdateField(templateField.id, { 
                            is_required_in_template: !!checked 
                          })}
                        />
                        <Label htmlFor={`required-${templateField.id}`}>Required in this template</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveField(templateField.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveField(templateField.id, 'down')}
                    disabled={index === templateFields.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveField(templateField.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templateFields.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-lg font-medium mb-2">No fields configured</h3>
            <p className="text-muted-foreground mb-4">
              Add custom fields to this template to define what information projects should capture
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}