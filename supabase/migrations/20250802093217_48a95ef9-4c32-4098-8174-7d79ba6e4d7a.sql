-- Add new fields to project_tasks table
ALTER TABLE public.project_tasks
ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
ADD COLUMN IF NOT EXISTS points integer DEFAULT 1 CHECK (points > 0),
ADD COLUMN IF NOT EXISTS dependencies jsonb DEFAULT '[]'::jsonb;