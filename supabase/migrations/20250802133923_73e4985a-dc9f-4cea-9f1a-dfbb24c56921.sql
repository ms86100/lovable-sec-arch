-- Update the sample project to use a proper UUID instead of placeholder
UPDATE projects 
SET id = gen_random_uuid() 
WHERE id = '22222222-2222-2222-2222-222222222222'::uuid;

-- Update related milestone to reference the correct project
UPDATE project_milestones 
SET project_id = (SELECT id FROM projects WHERE name = 'Advanced Security Platform Development' LIMIT 1)
WHERE project_id = '22222222-2222-2222-2222-222222222222'::uuid;

-- Update related tasks to reference the correct milestone
UPDATE project_tasks 
SET milestone_id = (SELECT id FROM project_milestones WHERE title = 'Deployment Phase' LIMIT 1)
WHERE milestone_id = '33333333-3333-3333-3333-333333333333'::uuid;