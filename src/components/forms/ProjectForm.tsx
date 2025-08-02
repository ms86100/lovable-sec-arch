import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ProjectFormProps {
  project?: any
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  name: string
  description: string
  status: string
  priority: string
  progress: number
  budget: number | null
  start_date: Date | null
  end_date: Date | null
  product_id: string
  template_id: string | null
  assigned_to: string | null
  operator_type: string
  external_company_name: string | null
}

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const { toast } = useToast()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      status: project?.status || 'planning',
      priority: project?.priority || 'medium',
      progress: project?.progress || 0,
      budget: project?.budget || null,
      start_date: project?.start_date ? new Date(project.start_date) : null,
      end_date: project?.end_date ? new Date(project.end_date) : null,
      product_id: project?.product_id || '',
      template_id: project?.template_id || null,
      assigned_to: project?.assigned_to || null,
      operator_type: project?.operator_type || 'internal',
      external_company_name: project?.external_company_name || null
    }
  })

  const watchedStartDate = watch('start_date')
  const watchedEndDate = watch('end_date')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name')
        .order('name')

      // Fetch templates
      const { data: templatesData } = await supabase
        .from('project_templates')
        .select('id, name')
        .order('name')

      // Fetch profiles for assignment
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .order('first_name')

      setProducts(productsData || [])
      setTemplates(templatesData || [])
      setProfiles(profilesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      // Validate required fields
      if (!data.product_id || data.product_id === '') {
        toast({
          title: 'Error',
          description: 'Please select a product',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      console.log('Form data before submission:', data)

      const projectData = {
        name: data.name,
        description: data.description,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        budget: data.budget,
        start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
        end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
        product_id: data.product_id,
        template_id: data.template_id || null,
        assigned_to: data.assigned_to || null,
        operator_type: data.operator_type,
        external_company_name: data.operator_type === 'external' ? data.external_company_name : null,
        updated_by: user?.id,
        is_active: true
      }

      console.log('Project data for submission:', projectData)

      if (project) {
        // Update existing project
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)

        if (error) throw error

        toast({
          title: 'Success',
          description: 'Project updated successfully',
        })
      } else {
        // Create new project
        console.log('Attempting to insert project with data:', {
          ...projectData,
          created_by: user?.id
        })
        
        const { error } = await supabase
          .from('projects')
          .insert({
            ...projectData,
            created_by: user?.id
          })

        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }

        toast({
          title: 'Success',
          description: 'Project created successfully',
        })
      }

      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async () => {
    if (!project) return
    
    setLoading(true)
    try {
      // Logical deletion - set is_active to false
      const { error } = await supabase
        .from('projects')
        .update({ 
          is_active: false, 
          updated_by: user?.id 
        })
        .eq('id', project.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      })
      onSuccess()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {project ? 'Edit Project' : 'Create New Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Project name is required' })}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_id">Product *</Label>
              <Select
                value={watch('product_id')}
                onValueChange={(value) => setValue('product_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!watch('product_id') && (
                <p className="text-sm text-destructive">Product selection is required</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={watch('priority')}
                onValueChange={(value) => setValue('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                {...register('progress', { min: 0, max: 100 })}
              />
            </div>
          </div>

          {/* Dates and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedStartDate ? format(watchedStartDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedStartDate || undefined}
                    onSelect={(date) => setValue('start_date', date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedEndDate ? format(watchedEndDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={watchedEndDate || undefined}
                    onSelect={(date) => setValue('end_date', date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                {...register('budget', { min: 0 })}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Assignment and Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select
                value={watch('assigned_to') || 'unassigned'}
                onValueChange={(value) => setValue('assigned_to', value === 'unassigned' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.user_id} value={profile.user_id}>
                      {profile.first_name} {profile.last_name} ({profile.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template_id">Template (Optional)</Label>
              <Select
                value={watch('template_id') || 'no_template'}
                onValueChange={(value) => setValue('template_id', value === 'no_template' ? null : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_template">No Template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project Operator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operator_type">Project Operator</Label>
              <Select
                value={watch('operator_type')}
                onValueChange={(value) => {
                  setValue('operator_type', value)
                  if (value === 'internal') {
                    setValue('external_company_name', null)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {watch('operator_type') === 'external' && (
              <div className="space-y-2">
                <Label htmlFor="external_company_name">External Company Name</Label>
                <Input
                  id="external_company_name"
                  {...register('external_company_name', {
                    required: watch('operator_type') === 'external' ? 'Company name is required for external operators' : false
                  })}
                  placeholder="Enter company name"
                />
                {errors.external_company_name && (
                  <p className="text-sm text-destructive">{errors.external_company_name.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <div>
              {project && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={deleteProject}
                  disabled={loading}
                >
                  Delete Project
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}