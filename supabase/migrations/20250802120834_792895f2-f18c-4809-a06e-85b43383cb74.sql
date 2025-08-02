-- Add estimated_effort_hours column to project_tasks table
ALTER TABLE project_tasks 
ADD COLUMN estimated_effort_hours DECIMAL(8,2);

-- Add some sample data for demonstration
UPDATE project_tasks 
SET estimated_effort_hours = 24 
WHERE estimated_effort_hours IS NULL;