-- Insert comprehensive dummy data for testing

-- Insert dummy products
INSERT INTO public.products (id, name, description, owner_id, tags, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Enterprise CRM Platform', 'Comprehensive customer relationship management system for enterprise clients', auth.uid(), ARRAY['CRM', 'Enterprise', 'Web'], auth.uid()),
('550e8400-e29b-41d4-a716-446655440002', 'Mobile Banking App', 'Secure mobile banking application with advanced features', auth.uid(), ARRAY['Mobile', 'Banking', 'Security'], auth.uid()),
('550e8400-e29b-41d4-a716-446655440003', 'E-Learning Platform', 'Online education platform with interactive content delivery', auth.uid(), ARRAY['Education', 'Web', 'SaaS'], auth.uid()),
('550e8400-e29b-41d4-a716-446655440004', 'Healthcare Analytics', 'Data analytics platform for healthcare providers', auth.uid(), ARRAY['Healthcare', 'Analytics', 'Data'], auth.uid());

-- Insert custom fields
INSERT INTO public.custom_fields (id, name, field_key, field_type, is_required, default_value, dropdown_options, help_text, created_by) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Export Control Assessment', 'export_control_assessment', 'dropdown', true, 'pending', ARRAY['pending', 'approved', 'restricted', 'not_applicable'], 'Export control classification status', auth.uid()),
('660e8400-e29b-41d4-a716-446655440002', 'Business Unit', 'business_unit', 'dropdown', true, '', ARRAY['Engineering', 'Marketing', 'Sales', 'Operations', 'Finance'], 'Primary business unit responsible', auth.uid()),
('660e8400-e29b-41d4-a716-446655440003', 'Compliance Level', 'compliance_level', 'dropdown', false, 'standard', ARRAY['basic', 'standard', 'enhanced', 'critical'], 'Required compliance level', auth.uid()),
('660e8400-e29b-41d4-a716-446655440004', 'Technical Stack', 'tech_stack', 'text', false, '', NULL, 'Primary technology stack used', auth.uid()),
('660e8400-e29b-41d4-a716-446655440005', 'Go Live Date', 'go_live_date', 'date', false, '', NULL, 'Planned production deployment date', auth.uid());

-- Insert project templates
INSERT INTO public.project_templates (id, name, description, is_public, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Software Development Project', 'Standard template for software development projects with all necessary phases', true, auth.uid()),
('770e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Template specifically designed for mobile application projects', true, auth.uid()),
('770e8400-e29b-41d4-a716-446655440003', 'Data Analytics Project', 'Template for data science and analytics initiatives', true, auth.uid()),
('770e8400-e29b-41d4-a716-446655440004', 'Infrastructure Migration', 'Template for cloud migration and infrastructure projects', false, auth.uid());

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
('880e8400-e29b-41d4-a716-446655440001', 'CRM Web Portal Development', 'Development of the main customer-facing web portal with advanced search and filtering capabilities', 'active', 'high', 75, 250000, '2024-01-15', '2024-06-30', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', auth.uid(), auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'Mobile App UI Redesign', 'Complete overhaul of the mobile banking app user interface for better user experience', 'active', 'medium', 45, 120000, '2024-02-01', '2024-05-15', '550e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440002', auth.uid(), auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'Security Compliance Audit', 'Comprehensive security audit and implementation of compliance requirements', 'planning', 'critical', 15, 85000, '2024-03-01', '2024-07-31', '550e8400-e29b-41d4-a716-446655440002', null, auth.uid(), auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'Learning Management System', 'Core LMS development with video streaming and assessment tools', 'active', 'high', 60, 180000, '2024-01-01', '2024-08-30', '550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', auth.uid(), auth.uid()),
('880e8400-e29b-41d4-a716-446655440005', 'Healthcare Data Pipeline', 'ETL pipeline for processing healthcare analytics data', 'on_hold', 'medium', 30, 95000, '2024-02-15', '2024-09-30', '550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440003', auth.uid(), auth.uid()),
('880e8400-e29b-41d4-a716-446655440006', 'CRM API Development', 'RESTful API development for CRM platform integration', 'completed', 'high', 100, 75000, '2023-10-01', '2024-01-15', '550e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', auth.uid(), auth.uid());

-- Insert project custom values
INSERT INTO public.project_custom_values (project_id, custom_field_id, field_value) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'approved'),
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'Engineering'),
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'enhanced'),
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004', 'React, Node.js, PostgreSQL'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'pending'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Engineering'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', '2024-05-01'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'restricted'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Operations'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440003', 'critical');

-- Insert project stakeholders
INSERT INTO public.project_stakeholders (project_id, name, email, department, role, influence_level, raci_role, contact_info, notes, is_internal, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.johnson@company.com', 'Engineering', 'decision_maker', 'high', 'accountable', '{"phone": "+1-555-0101"}', 'Lead Technical Architect and Project Sponsor', true, auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'Mike Chen', 'mike.chen@company.com', 'Product Management', 'contributor', 'high', 'responsible', '{"phone": "+1-555-0102"}', 'Product Owner responsible for requirements', true, auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'Emily Davis', 'emily.davis@client.com', 'IT', 'observer', 'medium', 'informed', '{"phone": "+1-555-0201"}', 'Client-side technical representative', false, auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'Alex Rivera', 'alex.rivera@company.com', 'UX Design', 'decision_maker', 'high', 'accountable', '{"phone": "+1-555-0103"}', 'Head of UX Design', true, auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'Lisa Wang', 'lisa.wang@company.com', 'Mobile Development', 'contributor', 'high', 'responsible', '{"phone": "+1-555-0104"}', 'Senior Mobile Developer', true, auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'David Brown', 'david.brown@company.com', 'Security', 'decision_maker', 'high', 'accountable', '{"phone": "+1-555-0105"}', 'Chief Security Officer', true, auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'Jennifer Martinez', 'jen.martinez@company.com', 'Education', 'decision_maker', 'high', 'accountable', '{"phone": "+1-555-0106"}', 'Head of Educational Technology', true, auth.uid());

-- Insert project servers
INSERT INTO public.project_servers (project_id, server_name, environment, ownership_type, last_assessment_date, assessment_type, export_control_status, configuration_details, notes, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'crm-web-prod-01', 'prod', 'digital', '2024-01-15', 'ard', 'not_controlled', '{"cpu": "8 cores", "memory": "32GB", "storage": "500GB SSD"}', 'Production web server for CRM portal', auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'crm-api-prod-01', 'prod', 'digital', '2024-01-15', 'ard', 'not_controlled', '{"cpu": "16 cores", "memory": "64GB", "storage": "1TB SSD"}', 'Production API server', auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'crm-db-prod-01', 'prod', 'digital', '2024-01-10', 'mrs', 'export_controlled', '{"cpu": "24 cores", "memory": "128GB", "storage": "2TB SSD"}', 'Production database server with customer data', auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'mobile-api-test-01', 'test', 'digital', '2024-02-01', 'ors', 'not_controlled', '{"cpu": "4 cores", "memory": "16GB", "storage": "250GB SSD"}', 'Testing environment for mobile API', auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'security-scan-01', 'int', 'business', '2024-02-28', 'ard', 'not_assessed', '{"cpu": "8 cores", "memory": "32GB", "storage": "500GB SSD"}', 'Security testing and vulnerability scanning', auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'lms-dev-01', 'dev', 'digital', '2024-01-20', 'ors', 'not_controlled', '{"cpu": "6 cores", "memory": "24GB", "storage": "300GB SSD"}', 'Development server for LMS', auth.uid());

-- Insert project risks
INSERT INTO public.project_risks (project_id, title, description, category, severity_level, probability, impact, status, mitigation_strategy, due_date, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Third-party API Integration Delays', 'Potential delays in integrating with external CRM APIs could impact timeline', 'technical', 'high', 'medium', 'high', 'open', 'Parallel development of mock APIs and early engagement with vendors', '2024-04-15', auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'Database Performance Issues', 'Large dataset queries may cause performance bottlenecks', 'technical', 'medium', 'high', 'medium', 'in_progress', 'Database optimization and indexing strategy implementation', '2024-03-30', auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'iOS App Store Approval', 'App store review process may cause deployment delays', 'operational', 'medium', 'medium', 'medium', 'open', 'Early submission to app stores and compliance review', '2024-05-01', auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'Compliance Requirements Change', 'New security regulations may require additional implementation', 'compliance', 'critical', 'low', 'critical', 'escalated', 'Regular monitoring of regulatory changes and stakeholder communication', '2024-06-01', auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'Video Streaming Infrastructure', 'Scalability concerns for video content delivery', 'technical', 'high', 'medium', 'high', 'resolved', 'CDN implementation completed successfully', '2024-02-15', auth.uid()),
('880e8400-e29b-41d4-a716-446655440005', 'Data Privacy Compliance', 'HIPAA compliance requirements for healthcare data', 'compliance', 'critical', 'high', 'critical', 'open', 'Legal review and privacy impact assessment', '2024-04-30', auth.uid());

-- Insert project issues
INSERT INTO public.project_issues (project_id, title, description, issue_type, priority, severity, status, assigned_to, reported_by, resolution_timeline, labels, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Login form validation not working', 'User login form does not properly validate email format and password strength', 'bug', 'high', 'medium', 'in_progress', auth.uid(), auth.uid(), '2024-03-20', ARRAY['frontend', 'validation', 'security'], auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'Add bulk import feature', 'Customers need ability to import contacts in bulk via CSV upload', 'feature', 'medium', 'low', 'open', auth.uid(), auth.uid(), '2024-04-15', ARRAY['enhancement', 'import', 'csv'], auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'App crashes on iOS 15', 'Mobile app consistently crashes when opening on iOS 15 devices', 'bug', 'critical', 'critical', 'open', auth.uid(), auth.uid(), '2024-03-25', ARRAY['mobile', 'ios', 'crash'], auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'Implement biometric authentication', 'Add fingerprint and face ID support for secure login', 'feature', 'high', 'medium', 'in_progress', auth.uid(), auth.uid(), '2024-04-30', ARRAY['security', 'biometric', 'authentication'], auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'SSL certificate configuration', 'Need to update SSL certificates for security compliance', 'task', 'high', 'high', 'resolved', auth.uid(), auth.uid(), '2024-03-01', ARRAY['security', 'ssl', 'certificates'], auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'Video playback buffering issues', 'Video content takes too long to load and frequently buffers', 'bug', 'medium', 'medium', 'open', auth.uid(), auth.uid(), '2024-03-30', ARRAY['video', 'performance', 'cdn'], auth.uid());

-- Insert project status updates
INSERT INTO public.project_status_updates (project_id, update_date, summary, progress_percentage, achievements, challenges, next_steps, budget_spent, milestone_reached, updated_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', '2024-01-29', 'Completed user authentication module and started customer dashboard development', 75, 'Authentication system fully implemented with JWT tokens, Database schema finalized and deployed', 'Integration with legacy customer data taking longer than expected', 'Complete customer dashboard UI, Implement search and filtering features', 187500, 'Authentication Module Complete', auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', '2024-02-26', 'UI mockups approved and development of core screens in progress', 45, 'All UI/UX designs approved by stakeholders, Navigation flow finalized', 'iOS and Android platform differences requiring separate implementations', 'Complete main dashboard screens, Implement biometric authentication', 54000, 'UI/UX Design Phase Complete', auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', '2024-02-19', 'Security assessment phase initiated with third-party auditors', 15, 'Security audit vendor selected and contract signed, Initial vulnerability scan completed', 'Discovery of legacy code requiring additional security hardening', 'Complete penetration testing, Implement security recommendations', 12750, 'Security Audit Kickoff', auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', '2024-02-12', 'Core learning modules implemented with video streaming capabilities', 60, 'Video streaming infrastructure deployed, User enrollment system completed', 'Performance optimization needed for large class sizes', 'Implement assessment tools, Add reporting dashboard', 108000, 'Video Streaming Module', auth.uid()),
('880e8400-e29b-41d4-a716-446655440006', '2024-01-08', 'Project successfully completed with all API endpoints delivered', 100, 'All REST endpoints implemented and tested, API documentation completed, Performance benchmarks exceeded', 'None - project completed successfully', 'Project handover to operations team', 75000, 'Project Completion', auth.uid());

-- Insert project suppliers
INSERT INTO public.project_suppliers (project_id, company_name, focal_point_name, focal_point_email, is_internal, supplier_type, contract_start_date, contract_end_date, contract_value, contact_info, roles_assigned, access_level, notes, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'TechSolutions Inc', 'Robert Wilson', 'robert.wilson@techsolutions.com', false, 'contractor', '2024-01-01', '2024-06-30', 75000, '{"phone": "+1-555-0301", "address": "123 Tech Street, Silicon Valley, CA"}', ARRAY['Frontend Development', 'API Integration'], 'limited', 'Specialized in React development and API integrations', auth.uid()),
('880e8400-e29b-41d4-a716-446655440001', 'DataVault Security', 'Maria Garcia', 'maria.garcia@datavault.com', false, 'consultant', '2024-02-01', '2024-05-31', 45000, '{"phone": "+1-555-0302", "address": "456 Security Blvd, Austin, TX"}', ARRAY['Security Audit', 'Compliance Review'], 'read_only', 'Security consulting for CRM platform', auth.uid()),
('880e8400-e29b-41d4-a716-446655440002', 'MobileFirst Design', 'James Thompson', 'james@mobilefirst.design', false, 'partner', '2024-01-15', '2024-12-31', 95000, '{"phone": "+1-555-0303", "website": "www.mobilefirst.design"}', ARRAY['UI/UX Design', 'Mobile Development'], 'limited', 'Long-term design partner for mobile projects', auth.uid()),
('880e8400-e29b-41d4-a716-446655440003', 'SecureAudit Corp', 'Dr. Amanda Lee', 'amanda.lee@secureaudit.com', false, 'vendor', '2024-02-15', '2024-07-15', 65000, '{"phone": "+1-555-0304", "certification": "ISO 27001 Lead Auditor"}', ARRAY['Security Testing', 'Compliance Certification'], 'limited', 'Certified security auditing firm', auth.uid()),
('880e8400-e29b-41d4-a716-446655440004', 'EduTech Partners', 'Kevin Chang', 'kevin.chang@edutech.com', false, 'partner', '2024-01-01', '2024-12-31', 120000, '{"phone": "+1-555-0305", "specialization": "Educational Technology"}', ARRAY['Content Development', 'LMS Integration'], 'full', 'Strategic education technology partner', auth.uid()),
('880e8400-e29b-41d4-a716-446655440005', 'CloudScale Analytics', 'Dr. Patricia Kumar', 'patricia@cloudscale.io', false, 'contractor', '2024-02-01', '2024-09-30', 85000, '{"phone": "+1-555-0306", "expertise": "Healthcare Data Analytics"}', ARRAY['Data Engineering', 'Analytics'], 'limited', 'Healthcare data specialists', auth.uid());