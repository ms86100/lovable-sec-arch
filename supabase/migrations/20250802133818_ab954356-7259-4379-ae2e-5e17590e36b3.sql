-- Update the sample project to use a proper UUID instead of placeholder
UPDATE projects 
SET id = gen_random_uuid() 
WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;

-- Update any related records that reference the old project ID
UPDATE project_milestones 
SET project_id = (SELECT id FROM projects WHERE name = 'Advanced Security Platform Development' LIMIT 1)
WHERE project_id = '22222222-2222-2222-2222-222222222222'::uuid;

UPDATE milestone_tasks 
SET project_id = (SELECT id FROM projects WHERE name = 'Advanced Security Platform Development' LIMIT 1)
WHERE project_id = '22222222-2222-2222-2222-222222222222'::uuid;