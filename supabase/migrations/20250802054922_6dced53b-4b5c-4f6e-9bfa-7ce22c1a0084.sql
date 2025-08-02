-- Phase 3: Advanced Features - Issue Tracking, Progress Reporting, Supplier Management

-- Issue & Incident Tracking Module
CREATE TABLE public.project_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  issue_type TEXT NOT NULL DEFAULT 'bug', -- bug, feature, task, incident, enhancement
  priority TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
  severity TEXT NOT NULL DEFAULT 'medium', -- critical, high, medium, low
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed, blocked
  assigned_to UUID REFERENCES auth.users(id),
  reported_by UUID REFERENCES auth.users(id),
  resolution_timeline DATE,
  resolution_notes TEXT,
  labels TEXT[],
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Progress & Reporting Module  
CREATE TABLE public.project_status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  achievements TEXT,
  challenges TEXT,
  next_steps TEXT,
  budget_spent NUMERIC,
  milestone_reached TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Supplier & External Collaboration Module
CREATE TABLE public.project_suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  focal_point_name TEXT,
  focal_point_email TEXT,
  is_internal BOOLEAN DEFAULT false,
  supplier_type TEXT DEFAULT 'vendor', -- vendor, contractor, partner, consultant
  contract_start_date DATE,
  contract_end_date DATE,
  contract_value NUMERIC,
  contact_info JSONB,
  roles_assigned TEXT[],
  access_level TEXT DEFAULT 'limited', -- full, limited, read_only, none
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.project_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_suppliers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_issues (security first)
CREATE POLICY "Users can view issues for accessible projects" 
ON public.project_issues FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_issues.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage issues for their projects" 
ON public.project_issues FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_issues.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- RLS Policies for project_status_updates
CREATE POLICY "Users can view status updates for accessible projects" 
ON public.project_status_updates FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_status_updates.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage status updates for their projects" 
ON public.project_status_updates FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_status_updates.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- RLS Policies for project_suppliers  
CREATE POLICY "Users can view suppliers for accessible projects" 
ON public.project_suppliers FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_suppliers.project_id 
    AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

CREATE POLICY "Users can manage suppliers for their projects" 
ON public.project_suppliers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    JOIN public.products pr ON pr.id = p.product_id
    WHERE p.id = project_suppliers.project_id 
    AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
  )
);

-- Performance indexes
CREATE INDEX idx_project_issues_project_id ON public.project_issues(project_id);
CREATE INDEX idx_project_issues_status ON public.project_issues(status);
CREATE INDEX idx_project_issues_priority ON public.project_issues(priority);
CREATE INDEX idx_project_status_updates_project_id ON public.project_status_updates(project_id);
CREATE INDEX idx_project_suppliers_project_id ON public.project_suppliers(project_id);

-- Auto-update triggers
CREATE TRIGGER update_project_issues_updated_at
  BEFORE UPDATE ON public.project_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_suppliers_updated_at
  BEFORE UPDATE ON public.project_suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();