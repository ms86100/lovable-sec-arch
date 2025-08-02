-- Create AOP (Annual Operating Plan) table
CREATE TABLE public.project_aop (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  activity TEXT NOT NULL,
  task_description TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'Development',
    'Enhancement', 
    'Bug Fixing',
    'Adaptive Maintenance',
    'Corrective Maintenance',
    'Preventive Maintenance',
    'Predictive Maintenance',
    'Obsolescence',
    'Run Mode / BAU (Business As Usual)',
    'Compliance & Security',
    'Infrastructure / Hosting',
    'Licensing',
    'Training & Enablement',
    'Monitoring & Support',
    'Documentation',
    'Change Request (CR)',
    'Transition / Handover'
  )),
  impact_risk_associated TEXT,
  amount_eur NUMERIC(12,2),
  aop_year INTEGER,
  approver TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

-- Enable Row Level Security
ALTER TABLE public.project_aop ENABLE ROW LEVEL SECURITY;

-- Create policies for AOP data
CREATE POLICY "Users can manage AOP for their projects" 
ON public.project_aop 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_aop.project_id 
  AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

CREATE POLICY "Users can view AOP for accessible projects" 
ON public.project_aop 
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM projects p
  JOIN products pr ON pr.id = p.product_id
  WHERE p.id = project_aop.project_id 
  AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(), 'manager'::app_role))
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_aop_updated_at
BEFORE UPDATE ON public.project_aop
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();