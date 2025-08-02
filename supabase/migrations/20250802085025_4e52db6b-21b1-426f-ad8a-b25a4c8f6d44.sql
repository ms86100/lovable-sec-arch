-- Add is_active column to projects table for logical deletion
ALTER TABLE public.projects 
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update existing projects to be active
UPDATE public.projects SET is_active = true WHERE is_active IS NULL;