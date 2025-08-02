-- Add new fields to project_tasks table
ALTER TABLE public.project_tasks
ADD COLUMN progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
ADD COLUMN points integer DEFAULT 1 CHECK (points > 0),
ADD COLUMN dependencies jsonb DEFAULT '[]'::jsonb;

-- Update the updated_at trigger for project_tasks if it doesn't exist
CREATE TRIGGER update_project_tasks_updated_at
    BEFORE UPDATE ON public.project_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();