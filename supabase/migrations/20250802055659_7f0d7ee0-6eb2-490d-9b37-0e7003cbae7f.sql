-- Get the first user ID for dummy data
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the first user from profiles table or create a dummy reference
    SELECT user_id INTO user_uuid FROM public.profiles LIMIT 1;
    
    IF user_uuid IS NULL THEN
        -- If no users exist, we'll use a placeholder UUID that represents the system
        user_uuid := '00000000-0000-0000-0000-000000000001';
    END IF;

    -- Insert dummy products with the found user_id
    INSERT INTO public.products (id, name, description, owner_id, tags, created_by) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Enterprise CRM Platform', 'Comprehensive customer relationship management system for enterprise clients', user_uuid, ARRAY['CRM', 'Enterprise', 'Web'], user_uuid),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mobile Banking App', 'Secure mobile banking application with advanced features', user_uuid, ARRAY['Mobile', 'Banking', 'Security'], user_uuid),
    ('550e8400-e29b-41d4-a716-446655440003', 'E-Learning Platform', 'Online education platform with interactive content delivery', user_uuid, ARRAY['Education', 'Web', 'SaaS'], user_uuid),
    ('550e8400-e29b-41d4-a716-446655440004', 'Healthcare Analytics', 'Data analytics platform for healthcare providers', user_uuid, ARRAY['Healthcare', 'Analytics', 'Data'], user_uuid);

    -- Insert custom fields
    INSERT INTO public.custom_fields (id, name, field_key, field_type, is_required, default_value, dropdown_options, help_text, created_by) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Export Control Assessment', 'export_control_assessment', 'dropdown', true, 'pending', ARRAY['pending', 'approved', 'restricted', 'not_applicable'], 'Export control classification status', user_uuid),
    ('660e8400-e29b-41d4-a716-446655440002', 'Business Unit', 'business_unit', 'dropdown', true, '', ARRAY['Engineering', 'Marketing', 'Sales', 'Operations', 'Finance'], 'Primary business unit responsible', user_uuid),
    ('660e8400-e29b-41d4-a716-446655440003', 'Compliance Level', 'compliance_level', 'dropdown', false, 'standard', ARRAY['basic', 'standard', 'enhanced', 'critical'], 'Required compliance level', user_uuid),
    ('660e8400-e29b-41d4-a716-446655440004', 'Technical Stack', 'tech_stack', 'text', false, '', NULL, 'Primary technology stack used', user_uuid),
    ('660e8400-e29b-41d4-a716-446655440005', 'Go Live Date', 'go_live_date', 'date', false, '', NULL, 'Planned production deployment date', user_uuid);

    -- Insert project templates
    INSERT INTO public.project_templates (id, name, description, is_public, created_by) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Software Development Project', 'Standard template for software development projects with all necessary phases', true, user_uuid),
    ('770e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Template specifically designed for mobile application projects', true, user_uuid),
    ('770e8400-e29b-41d4-a716-446655440003', 'Data Analytics Project', 'Template for data science and analytics initiatives', true, user_uuid),
    ('770e8400-e29b-41d4-a716-446655440004', 'Infrastructure Migration', 'Template for cloud migration and infrastructure projects', false, user_uuid);

    -- Continue with all other inserts using user_uuid...
    -- Insert template fields
    INSERT INTO public.template_fields (template_id, custom_field_id, field_order, is_required_in_template, template_default_value) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 1, true, 'pending'),
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 2, true, 'Engineering'),
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 3, false, 'standard'),
    ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 4, false, ''),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 1, true, 'pending'),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 2, true, 'Engineering'),
    ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', 3, true, '');

    -- Insert projects
    INSERT INTO public.projects (id, name, description, status, priority, progress, budget, start_date, end_date, product_id, template_id, assigned_to, created_by) VALUES
    ('880e8400-e29b-41d4-a716-446655440001', 'CRM Web Portal Development', 'Development of the main customer-facing web portal with advanced search and filtering capabilities', 'active', 'high', 75, 250000, '2024-01-15', '2024-06-30', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', user_uuid, user_uuid),
    ('880e8400-e29b-41d4-a716-446655440002', 'Mobile App UI Redesign', 'Complete overhaul of the mobile banking app user interface for better user experience', 'active', 'medium', 45, 120000, '2024-02-01', '2024-05-15', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', user_uuid, user_uuid),
    ('880e8400-e29b-41d4-a716-446655440003', 'Security Compliance Audit', 'Comprehensive security audit and implementation of compliance requirements', 'planning', 'critical', 15, 85000, '2024-03-01', '2024-07-31', '550e8400-e29b-41d4-a716-446655440002', null, user_uuid, user_uuid),
    ('880e8400-e29b-41d4-a716-446655440004', 'Learning Management System', 'Core LMS development with video streaming and assessment tools', 'active', 'high', 60, 180000, '2024-01-01', '2024-08-30', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', user_uuid, user_uuid),
    ('880e8400-e29b-41d4-a716-446655440005', 'Healthcare Data Pipeline', 'ETL pipeline for processing healthcare analytics data', 'on_hold', 'medium', 30, 95000, '2024-02-15', '2024-09-30', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', user_uuid, user_uuid),
    ('880e8400-e29b-41d4-a716-446655440006', 'CRM API Development', 'RESTful API development for CRM platform integration', 'completed', 'high', 100, 75000, '2023-10-01', '2024-01-15', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', user_uuid, user_uuid);

END $$;