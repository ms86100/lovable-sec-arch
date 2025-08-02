-- Create custom field definitions table
CREATE TABLE public.custom_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- Human readable name
  field_key TEXT NOT NULL, -- Database column name (auto-suggested, editable)
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'date', 'dropdown', 'checkbox', 'email', 'url')),
  is_required BOOLEAN DEFAULT false,
  default_value TEXT,
  dropdown_options TEXT[], -- For dropdown type
  validation_rules JSONB, -- For validation constraints
  help_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create templates table
CREATE TABLE public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false, -- Can be used by other users
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Junction table for templates and their custom fields
CREATE TABLE public.template_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.project_templates(id) ON DELETE CASCADE,
  custom_field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  field_order INTEGER DEFAULT 0,
  is_required_in_template BOOLEAN DEFAULT false,
  template_default_value TEXT,
  UNIQUE(template_id, custom_field_id)
);

-- Table to store custom field values for projects
CREATE TABLE public.project_custom_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  custom_field_id UUID NOT NULL REFERENCES public.custom_fields(id) ON DELETE CASCADE,
  field_value TEXT, -- Store all values as text, parse based on field_type
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, custom_field_id)
);

-- Add template reference to projects table
ALTER TABLE public.projects ADD COLUMN template_id UUID REFERENCES public.project_templates(id);

-- Enable Row Level Security
ALTER TABLE public.custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_custom_values ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_fields
CREATE POLICY "Users can view custom fields they have access to" 
ON public.custom_fields 
FOR SELECT 
USING (
  -- Creators can view their fields
  created_by = auth.uid() OR
  -- Admins can view all fields
  public.is_admin(auth.uid()) OR
  -- Managers can view all fields
  public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Managers and admins can create custom fields" 
ON public.custom_fields 
FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'manager') OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Field creators and admins can update custom fields" 
ON public.custom_fields 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Field creators and admins can delete custom fields" 
ON public.custom_fields 
FOR DELETE 
USING (
  created_by = auth.uid() OR 
  public.is_admin(auth.uid())
);

-- RLS Policies for project_templates
CREATE POLICY "Users can view accessible templates" 
ON public.project_templates 
FOR SELECT 
USING (
  -- Public templates
  is_public = true OR
  -- Own templates
  created_by = auth.uid() OR
  -- Admins can view all
  public.is_admin(auth.uid()) OR
  -- Managers can view all
  public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Managers and admins can create templates" 
ON public.project_templates 
FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'manager') OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Template creators and admins can update templates" 
ON public.project_templates 
FOR UPDATE 
USING (
  created_by = auth.uid() OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Template creators and admins can delete templates" 
ON public.project_templates 
FOR DELETE 
USING (
  created_by = auth.uid() OR 
  public.is_admin(auth.uid())
);

-- RLS Policies for template_fields
CREATE POLICY "Users can view template fields for accessible templates" 
ON public.template_fields 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.project_templates 
    WHERE project_templates.id = template_fields.template_id 
    AND (
      project_templates.is_public = true OR
      project_templates.created_by = auth.uid() OR
      public.is_admin(auth.uid()) OR
      public.has_role(auth.uid(), 'manager')
    )
  )
);

CREATE POLICY "Template creators can manage template fields" 
ON public.template_fields 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.project_templates 
    WHERE project_templates.id = template_fields.template_id 
    AND (
      project_templates.created_by = auth.uid() OR
      public.is_admin(auth.uid())
    )
  )
);

-- RLS Policies for project_custom_values
CREATE POLICY "Users can view custom values for accessible projects" 
ON public.project_custom_values 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    JOIN public.products ON products.id = projects.product_id
    WHERE projects.id = project_custom_values.project_id 
    AND (
      products.owner_id = auth.uid() OR
      projects.assigned_to = auth.uid() OR
      public.is_admin(auth.uid()) OR
      public.has_role(auth.uid(), 'manager')
    )
  )
);

CREATE POLICY "Users can manage custom values for their projects" 
ON public.project_custom_values 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    JOIN public.products ON products.id = projects.product_id
    WHERE projects.id = project_custom_values.project_id 
    AND (
      products.owner_id = auth.uid() OR
      projects.assigned_to = auth.uid() OR
      public.is_admin(auth.uid())
    )
  )
);

-- Create indexes for better performance
CREATE INDEX idx_custom_fields_created_by ON public.custom_fields(created_by);
CREATE INDEX idx_project_templates_created_by ON public.project_templates(created_by);
CREATE INDEX idx_project_templates_is_public ON public.project_templates(is_public);
CREATE INDEX idx_template_fields_template_id ON public.template_fields(template_id);
CREATE INDEX idx_template_fields_order ON public.template_fields(template_id, field_order);
CREATE INDEX idx_project_custom_values_project ON public.project_custom_values(project_id);
CREATE INDEX idx_project_custom_values_field ON public.project_custom_values(custom_field_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_custom_fields_updated_at
  BEFORE UPDATE ON public.custom_fields
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_templates_updated_at
  BEFORE UPDATE ON public.project_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_custom_values_updated_at
  BEFORE UPDATE ON public.project_custom_values
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();