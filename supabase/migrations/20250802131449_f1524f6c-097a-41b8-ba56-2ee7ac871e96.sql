-- Insert sample data for CPM demonstration
-- First, get a user ID from existing users or create a placeholder
DO $$
DECLARE
    sample_user_id uuid;
BEGIN
    -- Try to get an existing user ID
    SELECT user_id INTO sample_user_id FROM public.profiles LIMIT 1;
    
    -- If no user found, use a placeholder UUID (this should be replaced with real user ID)
    IF sample_user_id IS NULL THEN
        sample_user_id := '00000000-0000-0000-0000-000000000000'::uuid;
    END IF;

    -- Insert sample product
    INSERT INTO products (id, name, description, owner_id) 
    VALUES (
      '11111111-1111-1111-1111-111111111111'::uuid,
      'Advanced Security Platform',
      'A comprehensive security platform with advanced threat detection',
      sample_user_id
    ) ON CONFLICT (id) DO UPDATE SET 
      name = EXCLUDED.name,
      description = EXCLUDED.description;

    -- Insert sample project
    INSERT INTO projects (id, product_id, name, description, status, priority, progress, start_date, end_date, budget) 
    VALUES (
      '22222222-2222-2222-2222-222222222222'::uuid,
      '11111111-1111-1111-1111-111111111111'::uuid,
      'Advanced Security Platform Development',
      'Development of a comprehensive security platform with advanced threat detection capabilities',
      'active',
      'high',
      45,
      '2024-01-01'::date,
      '2024-06-30'::date,
      500000
    ) ON CONFLICT (id) DO UPDATE SET 
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      status = EXCLUDED.status,
      priority = EXCLUDED.priority,
      progress = EXCLUDED.progress;

    -- Create sample milestone for the deployment phase
    INSERT INTO project_milestones (id, project_id, title, description, status, progress, due_date) 
    VALUES (
      '33333333-3333-3333-3333-333333333333'::uuid,
      '22222222-2222-2222-2222-222222222222'::uuid,
      'Deployment Phase',
      'Complete deployment and integration testing of the security platform',
      'active',
      30,
      '2024-03-15'::date
    ) ON CONFLICT (id) DO UPDATE SET 
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      status = EXCLUDED.status,
      progress = EXCLUDED.progress;
END $$;

-- Insert sample tasks following the CPM example structure
-- T1: Setup Infrastructure (5 days, no dependencies)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '10000000-0000-0000-0000-000000000001'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Setup Infrastructure',
  'Setup cloud infrastructure including servers, networking, and security groups',
  40, -- 5 days * 8 hours
  '[]'::jsonb,
  'pending',
  'high'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T2: Deploy Backend (4 days, depends on T1)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '20000000-0000-0000-0000-000000000002'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Deploy Backend Services',
  'Deploy and configure backend API services, databases, and authentication systems',
  32, -- 4 days * 8 hours
  '["10000000-0000-0000-0000-000000000001"]'::jsonb,
  'pending',
  'high'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T3: Security Configuration (6 days, depends on T1)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '30000000-0000-0000-0000-000000000003'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Security Configuration',
  'Configure security policies, SSL certificates, firewalls, and access controls',
  48, -- 6 days * 8 hours
  '["10000000-0000-0000-0000-000000000001"]'::jsonb,
  'pending',
  'critical'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T4: Database Migration (10 days, depends on T2 and T3)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '40000000-0000-0000-0000-000000000004'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Database Migration & Optimization',
  'Migrate production data and optimize database performance for security platform',
  80, -- 10 days * 8 hours
  '["20000000-0000-0000-0000-000000000002", "30000000-0000-0000-0000-000000000003"]'::jsonb,
  'pending',
  'high'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T5: Frontend Deployment (6 days, depends on T2 and T3)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '50000000-0000-0000-0000-000000000005'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Frontend Deployment',
  'Deploy and configure frontend dashboard and user interfaces',
  48, -- 6 days * 8 hours
  '["20000000-0000-0000-0000-000000000002", "30000000-0000-0000-0000-000000000003"]'::jsonb,
  'pending',
  'medium'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T6: System Integration (4 days, depends on T4 and T5)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '60000000-0000-0000-0000-000000000006'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'System Integration',
  'Integrate all components and ensure proper communication between services',
  32, -- 4 days * 8 hours
  '["40000000-0000-0000-0000-000000000004", "50000000-0000-0000-0000-000000000005"]'::jsonb,
  'pending',
  'high'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T7: Performance Testing (5 days, depends on T6)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '70000000-0000-0000-0000-000000000007'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Performance Testing',
  'Conduct comprehensive performance and load testing of the entire system',
  40, -- 5 days * 8 hours
  '["60000000-0000-0000-0000-000000000006"]'::jsonb,
  'pending',
  'medium'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;

-- T8: Final Deployment (2 days, depends on T7)
INSERT INTO project_tasks (id, milestone_id, title, description, estimated_effort_hours, dependencies, status, priority) 
VALUES (
  '80000000-0000-0000-0000-000000000008'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Production Deployment',
  'Final deployment to production environment and go-live procedures',
  16, -- 2 days * 8 hours
  '["70000000-0000-0000-0000-000000000007"]'::jsonb,
  'pending',
  'critical'
) ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_effort_hours = EXCLUDED.estimated_effort_hours,
  dependencies = EXCLUDED.dependencies;