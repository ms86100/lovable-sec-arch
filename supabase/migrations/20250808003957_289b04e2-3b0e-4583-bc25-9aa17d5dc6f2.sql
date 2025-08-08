-- 1) Retrospectives core table
CREATE TABLE IF NOT EXISTS public.retrospectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  iteration_id uuid REFERENCES public.iterations(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  facilitator text,
  notes text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid
);

ALTER TABLE public.retrospectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage retrospectives for their projects"
ON public.retrospectives
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = retrospectives.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = retrospectives.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view retrospectives for accessible projects"
ON public.retrospectives
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = retrospectives.project_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_retrospectives_project_id ON public.retrospectives(project_id);

CREATE TRIGGER update_retrospectives_updated_at
BEFORE UPDATE ON public.retrospectives
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 1a) Retrospective Lessons
CREATE TABLE IF NOT EXISTS public.retrospective_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retrospective_id uuid NOT NULL REFERENCES public.retrospectives(id) ON DELETE CASCADE,
  type text,
  description text NOT NULL,
  impact text DEFAULT 'medium',
  categories text[] DEFAULT '{}',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.retrospective_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage retrospective lessons for their projects"
ON public.retrospective_lessons
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_lessons.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_lessons.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view retrospective lessons for accessible projects"
ON public.retrospective_lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_lessons.retrospective_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_lessons_retro_id ON public.retrospective_lessons(retrospective_id);

CREATE TRIGGER update_retrospective_lessons_updated_at
BEFORE UPDATE ON public.retrospective_lessons
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 1b) Retrospective RCA
CREATE TABLE IF NOT EXISTS public.retrospective_rca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retrospective_id uuid NOT NULL REFERENCES public.retrospectives(id) ON DELETE CASCADE,
  method text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  linked_lesson_id uuid REFERENCES public.retrospective_lessons(id) ON DELETE SET NULL,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.retrospective_rca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage RCA for their projects"
ON public.retrospective_rca
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_rca.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_rca.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view RCA for accessible projects"
ON public.retrospective_rca
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_rca.retrospective_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_rca_retro_id ON public.retrospective_rca(retrospective_id);

CREATE TRIGGER update_retrospective_rca_updated_at
BEFORE UPDATE ON public.retrospective_rca
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 1c) Retrospective Actions
CREATE TABLE IF NOT EXISTS public.retrospective_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retrospective_id uuid NOT NULL REFERENCES public.retrospectives(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  owner_id uuid,
  due_date date,
  status text NOT NULL DEFAULT 'open',
  linked_task_id uuid REFERENCES public.project_tasks(id) ON DELETE SET NULL,
  target_iteration_id uuid REFERENCES public.iterations(id) ON DELETE SET NULL,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.retrospective_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage retrospective actions for their projects"
ON public.retrospective_actions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_actions.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_actions.retrospective_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view retrospective actions for accessible projects"
ON public.retrospective_actions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM retrospectives r
    JOIN projects p ON p.id = r.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE r.id = retrospective_actions.retrospective_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_actions_retro_id ON public.retrospective_actions(retrospective_id);
CREATE INDEX IF NOT EXISTS idx_actions_owner_due ON public.retrospective_actions(owner_id, due_date);

CREATE TRIGGER update_retrospective_actions_updated_at
BEFORE UPDATE ON public.retrospective_actions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) What-If Scenarios
CREATE TABLE IF NOT EXISTS public.what_if_scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  variables jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_summary jsonb,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.what_if_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage scenarios for their projects"
ON public.what_if_scenarios
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = what_if_scenarios.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = what_if_scenarios.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view scenarios for accessible projects"
ON public.what_if_scenarios
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = what_if_scenarios.project_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_scenarios_project_id ON public.what_if_scenarios(project_id);

CREATE TRIGGER update_what_if_scenarios_updated_at
BEFORE UPDATE ON public.what_if_scenarios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2a) Monte Carlo runs (optional detail per scenario)
CREATE TABLE IF NOT EXISTS public.monte_carlo_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid NOT NULL REFERENCES public.what_if_scenarios(id) ON DELETE CASCADE,
  runs integer NOT NULL DEFAULT 1000,
  inputs jsonb,
  outputs jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.monte_carlo_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage monte carlo runs for their projects"
ON public.monte_carlo_runs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM what_if_scenarios s
    JOIN projects p ON p.id = s.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE s.id = monte_carlo_runs.scenario_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM what_if_scenarios s
    JOIN projects p ON p.id = s.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE s.id = monte_carlo_runs.scenario_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view monte carlo runs for accessible projects"
ON public.monte_carlo_runs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM what_if_scenarios s
    JOIN projects p ON p.id = s.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE s.id = monte_carlo_runs.scenario_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_mc_scenario_id ON public.monte_carlo_runs(scenario_id);

-- 3) Task-level Risk fields on project_tasks
ALTER TABLE public.project_tasks
  ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS risk_probability integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_impact integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS mitigation_plan text;

-- 4) Capacity: iteration members
CREATE TABLE IF NOT EXISTS public.iteration_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  iteration_id uuid NOT NULL REFERENCES public.iterations(id) ON DELETE CASCADE,
  member_id uuid,
  availability_percent integer NOT NULL DEFAULT 100,
  role text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.iteration_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage iteration members for their projects"
ON public.iteration_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM iterations i
    JOIN program_increments pi ON pi.id = i.pi_id
    JOIN projects p ON p.id = pi.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE i.id = iteration_members.iteration_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM iterations i
    JOIN program_increments pi ON pi.id = i.pi_id
    JOIN projects p ON p.id = pi.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE i.id = iteration_members.iteration_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view iteration members for accessible projects"
ON public.iteration_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM iterations i
    JOIN program_increments pi ON pi.id = i.pi_id
    JOIN projects p ON p.id = pi.project_id
    JOIN products pr ON pr.id = p.product_id
    WHERE i.id = iteration_members.iteration_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_iteration_members_iter ON public.iteration_members(iteration_id);

CREATE TRIGGER update_iteration_members_updated_at
BEFORE UPDATE ON public.iteration_members
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Feasibility Assessments
CREATE TABLE IF NOT EXISTS public.feasibility_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  technical jsonb NOT NULL DEFAULT '{}'::jsonb,
  financial jsonb NOT NULL DEFAULT '{}'::jsonb,
  operational jsonb NOT NULL DEFAULT '{}'::jsonb,
  technical_score integer NOT NULL DEFAULT 0,
  financial_score integer NOT NULL DEFAULT 0,
  operational_score integer NOT NULL DEFAULT 0,
  total_score integer NOT NULL DEFAULT 0,
  decision text NOT NULL DEFAULT 'revisit',
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feasibility_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage feasibility for their projects"
ON public.feasibility_assessments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = feasibility_assessments.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = feasibility_assessments.project_id
      AND (pr.owner_id = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE POLICY "Users can view feasibility for accessible projects"
ON public.feasibility_assessments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects p
    JOIN products pr ON pr.id = p.product_id
    WHERE p.id = feasibility_assessments.project_id
      AND (pr.owner_id = auth.uid() OR p.assigned_to = auth.uid() OR is_admin(auth.uid()) OR has_role(auth.uid(),'manager'))
  )
);

CREATE INDEX IF NOT EXISTS idx_feasibility_project_id ON public.feasibility_assessments(project_id);

CREATE TRIGGER update_feasibility_assessments_updated_at
BEFORE UPDATE ON public.feasibility_assessments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();