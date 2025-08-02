import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface CustomField {
  id?: string
  name: string
  field_key: string
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'email' | 'url'
  is_required: boolean
  default_value: string
  dropdown_options: string[]
  help_text: string
}

interface CustomFieldFormProps {
  field?: CustomField
  onSuccess: () => void
  onCancel: () => void
}

export function CustomFieldForm({ field, onSuccess, onCancel }: CustomFieldFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CustomField>({
    name: field?.name || '',
    field_key: field?.field_key || '',
    field_type: field?.field_type || 'text',
    is_required: field?.is_required || false,
    default_value: field?.default_value || '',
    dropdown_options: field?.dropdown_options || [],
    help_text: field?.help_text || ''
  })
  const [newOption, setNewOption] = useState('')

  // Auto-generate field key from name
  const generateFieldKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50)
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      field_key: prev.field_key || generateFieldKey(name)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const fieldData = {
        name: formData.name.trim(),
        field_key: formData.field_key.trim(),
        field_type: formData.field_type,
        is_required: formData.is_required,
        default_value: formData.default_value.trim() || null,
        dropdown_options: formData.field_type === 'dropdown' && formData.dropdown_options.length > 0 ? formData.dropdown_options : null,
        help_text: formData.help_text.trim() || null,
        updated_by: user?.id || null
      }

      let error
      if (field?.id) {
        const { error: updateError } = await supabase
          .from('custom_fields')
          .update(fieldData)
          .eq('id', field.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('custom_fields')
          .insert({
            ...fieldData,
            created_by: user?.id || null
          })
        error = insertError
      }

      if (error) throw error

      toast({
        title: field?.id ? "Field Updated" : "Field Created",
        description: `${formData.name} has been ${field?.id ? 'updated' : 'created'} successfully.`
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

  const handleAddOption = () => {
    const option = newOption.trim()
    if (option && !formData.dropdown_options.includes(option)) {
      setFormData(prev => ({
        ...prev,
        dropdown_options: [...prev.dropdown_options, option]
      }))
      setNewOption('')
    }
  }

  const handleRemoveOption = (optionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      dropdown_options: prev.dropdown_options.filter(option => option !== optionToRemove)
    }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{field?.id ? 'Edit Custom Field' : 'Create Custom Field'}</CardTitle>
        <CardDescription>
          Define a custom field that can be used in project templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Field Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Export Control Assessment"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_key">Database Key *</Label>
              <Input
                id="field_key"
                value={formData.field_key}
                onChange={(e) => setFormData(prev => ({ ...prev, field_key: e.target.value }))}
                placeholder="e.g. export_control_assessment"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_type">Field Type *</Label>
            <Select value={formData.field_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, field_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Long Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="url">URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.field_type === 'dropdown' && (
            <div className="space-y-2">
              <Label>Dropdown Options</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.dropdown_options.map((option) => (
                  <div key={option} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded">
                    <span className="text-sm">{option}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => handleRemoveOption(option)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add option..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={!newOption.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="default_value">Default Value</Label>
            <Input
              id="default_value"
              value={formData.default_value}
              onChange={(e) => setFormData(prev => ({ ...prev, default_value: e.target.value }))}
              placeholder="Optional default value"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="help_text">Help Text</Label>
            <Textarea
              id="help_text"
              value={formData.help_text}
              onChange={(e) => setFormData(prev => ({ ...prev, help_text: e.target.value }))}
              placeholder="Help text to guide users..."
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_required"
              checked={formData.is_required}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_required: !!checked }))}
            />
            <Label htmlFor="is_required">Required field</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.field_key.trim()}>
              {loading ? 'Saving...' : (field?.id ? 'Update Field' : 'Create Field')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}