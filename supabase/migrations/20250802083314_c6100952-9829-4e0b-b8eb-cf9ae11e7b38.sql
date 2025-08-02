-- Create project milestones table
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create project tasks table
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  owner_id UUID,
  owner_type TEXT NOT NULL DEFAULT 'stakeholder', -- 'stakeholder' or 'team_member'
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create project team members table
CREATE TABLE public.project_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL,
  department TEXT,
  skills JSONB,
  availability_hours INTEGER DEFAULT 40,
  hourly_rate NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create project budget items table
CREATE TABLE public.project_budget_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  planned_amount NUMERIC NOT NULL DEFAULT 0,
  actual_amount NUMERIC DEFAULT 0,
  description TEXT,
  date_incurred DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Create RACI matrix table
CREATE TABLE public.project_raci_matrix (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  activity_name TEXT NOT NULL,
  responsible_id UUID,
  responsible_type TEXT, -- 'stakeholder' or 'team_member'
  accountable_id UUID,
  accountable_type TEXT,
  consulted_ids JSONB, -- Array of {id, type} objects
  informed_ids JSONB, -- Array of {id, type} objects
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable RLS on all new tables
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_raci_matrix ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_milestones
CREATE POLICY "Users can manage milestones for their projects" 
ON public.project_milestones 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_milestones.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

CREATE POLICY "Users can view milestones for accessible projects" 
ON public.project_milestones 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_milestones.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

-- Create RLS policies for project_tasks
CREATE POLICY "Users can manage tasks for their projects" 
ON public.project_tasks 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM project_milestones pm 
  JOIN projects p ON p.id = pm.project_id 
  JOIN products pr ON pr.id = p.product_id 
  WHERE pm.id = project_tasks.milestone_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

CREATE POLICY "Users can view tasks for accessible projects" 
ON public.project_tasks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM project_milestones pm 
  JOIN projects p ON p.id = pm.project_id 
  JOIN products pr ON pr.id = p.product_id 
  WHERE pm.id = project_tasks.milestone_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

-- Create RLS policies for project_team_members
CREATE POLICY "Users can manage team members for their projects" 
ON public.project_team_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_team_members.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

CREATE POLICY "Users can view team members for accessible projects" 
ON public.project_team_members 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_team_members.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

-- Create RLS policies for project_budget_items
CREATE POLICY "Users can manage budget items for their projects" 
ON public.project_budget_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_budget_items.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

CREATE POLICY "Users can view budget items for accessible projects" 
ON public.project_budget_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_budget_items.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

-- Create RLS policies for project_raci_matrix
CREATE POLICY "Users can manage RACI matrix for their projects" 
ON public.project_raci_matrix 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_raci_matrix.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

CREATE POLICY "Users can view RACI matrix for accessible projects" 
ON public.project_raci_matrix 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM projects p 
  JOIN products pr ON pr.id = p.product_id 
  WHERE p.id = project_raci_matrix.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'))
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_team_members_updated_at
  BEFORE UPDATE ON public.project_team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_budget_items_updated_at
  BEFORE UPDATE ON public.project_budget_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_raci_matrix_updated_at
  BEFORE UPDATE ON public.project_raci_matrix
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();