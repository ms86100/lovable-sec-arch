-- Add project operator fields to projects table
ALTER TABLE public.projects 
ADD COLUMN operator_type TEXT DEFAULT 'internal' CHECK (operator_type IN ('internal', 'external')),
ADD COLUMN external_company_name TEXT;

-- Update project_servers table structure
ALTER TABLE public.project_servers 
DROP COLUMN IF EXISTS ownership_type,
DROP COLUMN IF EXISTS export_control_status,
DROP COLUMN IF EXISTS last_assessment_date,
ADD COLUMN server_type TEXT DEFAULT 'on_prem' CHECK (server_type IN ('on_prem', 'cloud'));

-- Create security_compliance table
CREATE TABLE public.project_security_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  data_compliance_last_assessment DATE,
  export_control_status TEXT CHECK (export_control_status IN ('export_controlled', 'dual_use', 'military', 'controlled_other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS on security_compliance table
ALTER TABLE public.project_security_compliance ENABLE ROW LEVEL SECURITY;

-- RLS policies for security_compliance
CREATE POLICY "Users can manage security compliance for their projects" 
ON public.project_security_compliance 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_security_compliance.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

CREATE POLICY "Users can view security compliance for accessible projects" 
ON public.project_security_compliance 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_security_compliance.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

-- Create documentation table
CREATE TABLE public.project_documentation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  last_updated_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS on documentation table
ALTER TABLE public.project_documentation ENABLE ROW LEVEL SECURITY;

-- RLS policies for documentation
CREATE POLICY "Users can manage documentation for their projects" 
ON public.project_documentation 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_documentation.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

CREATE POLICY "Users can view documentation for accessible projects" 
ON public.project_documentation 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_documentation.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

-- Add triggers for updated_at
CREATE TRIGGER update_project_security_compliance_updated_at
  BEFORE UPDATE ON public.project_security_compliance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_documentation_updated_at
  BEFORE UPDATE ON public.project_documentation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();