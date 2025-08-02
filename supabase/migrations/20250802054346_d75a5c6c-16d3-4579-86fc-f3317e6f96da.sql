-- Phase 2: Core Data Management Tables

-- Team & Stakeholders Module
CREATE TABLE public.project_stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  role TEXT NOT NULL, -- Decision Maker, Contributor, Observer
  influence_level TEXT NOT NULL DEFAULT 'medium', -- high, medium, low
  raci_role TEXT, -- Responsible, Accountable, Consulted, Informed
  contact_info JSONB, -- Phone, address, etc.
  notes TEXT,
  is_internal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Technical Infrastructure Module
CREATE TABLE public.project_servers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  server_name TEXT NOT NULL,
  environment TEXT NOT NULL, -- INT, PROD, Non-Prod, DEV, TEST
  configuration_details JSONB,
  ownership_type TEXT DEFAULT 'digital', -- digital, business
  last_assessment_date DATE,
  assessment_type TEXT, -- ARD, ORS, MRS
  export_control_status TEXT DEFAULT 'not_assessed', -- export_controlled, dual_use, military, not_controlled, not_assessed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Risk Management Module
CREATE TABLE public.project_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'operational', -- operational, technical, financial, compliance, strategic
  severity_level TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
  probability TEXT NOT NULL DEFAULT 'medium', -- very_high, high, medium, low, very_low
  impact TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low, minimal
  risk_score INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN severity_level = 'critical' THEN 5
      WHEN severity_level = 'high' THEN 4
      WHEN severity_level = 'medium' THEN 3
      WHEN severity_level = 'low' THEN 2
      ELSE 1
    END *
    CASE 
      WHEN probability = 'very_high' THEN 5
      WHEN probability = 'high' THEN 4
      WHEN probability = 'medium' THEN 3
      WHEN probability = 'low' THEN 2
      ELSE 1
    END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, escalated, accepted
  mitigation_strategy TEXT,
  risk_owner UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  resolution_date DATE,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.project_stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_stakeholders
CREATE POLICY "Users can view stakeholders for accessible projects" 
ON public.project_stakeholders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_stakeholders.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage stakeholders for their projects" 
ON public.project_stakeholders 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_stakeholders.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- RLS Policies for project_servers
CREATE POLICY "Users can view servers for accessible projects" 
ON public.project_servers 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_servers.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage servers for their projects" 
ON public.project_servers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_servers.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- RLS Policies for project_risks
CREATE POLICY "Users can view risks for accessible projects" 
ON public.project_risks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_risks.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage risks for their projects" 
ON public.project_risks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_risks.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_project_stakeholders_updated_at
  BEFORE UPDATE ON public.project_stakeholders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_servers_updated_at
  BEFORE UPDATE ON public.project_servers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_risks_updated_at
  BEFORE UPDATE ON public.project_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_project_stakeholders_project_id ON public.project_stakeholders(project_id);
CREATE INDEX idx_project_servers_project_id ON public.project_servers(project_id);
CREATE INDEX idx_project_risks_project_id ON public.project_risks(project_id);
CREATE INDEX idx_project_risks_status ON public.project_risks(status);
CREATE INDEX idx_project_risks_severity ON public.project_risks(severity_level);
CREATE INDEX idx_project_servers_environment ON public.project_servers(environment);