-- Create additional dummy projects for the existing products
INSERT INTO projects (id, product_id, name, description, status, priority, budget, progress, start_date, end_date, assigned_to, created_by) VALUES 
('abc12345-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'CRM Mobile Optimization', 'Optimize CRM platform for mobile devices and improve user experience', 'active', 'high', 350000.00, 65, '2024-02-01', '2024-08-31', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('abc12345-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Banking Security Enhancement', 'Implement advanced security features and compliance requirements', 'active', 'critical', 280000.00, 80, '2024-01-15', '2024-07-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('abc12345-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'E-Learning Analytics Dashboard', 'Build comprehensive analytics and reporting dashboard', 'completed', 'medium', 150000.00, 100, '2023-09-01', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('abc12345-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Healthcare Data Integration', 'Integrate multiple healthcare data sources for comprehensive analytics', 'planning', 'high', 420000.00, 15, '2024-07-01', '2024-12-31', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create team members for the projects
INSERT INTO project_team_members (id, project_id, name, role, email, department, availability_hours, hourly_rate, skills, created_by) VALUES 
-- CRM Mobile Optimization team
('tm000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'Project Manager', 'sarah.johnson@company.com', 'Engineering', 40, 85.00, '["project-management", "agile", "stakeholder-communication"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000001-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440001', 'Mike Chen', 'Senior Mobile Developer', 'mike.chen@company.com', 'Engineering', 40, 95.00, '["react-native", "ios", "android", "ui-ux"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000001-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440001', 'Emily Rodriguez', 'Backend Developer', 'emily.rodriguez@company.com', 'Engineering', 35, 90.00, '["node.js", "postgresql", "api-design", "microservices"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000001-e29b-41d4-a716-446655440004', 'abc12345-e29b-41d4-a716-446655440001', 'Alex Kim', 'UX Designer', 'alex.kim@company.com', 'Design', 35, 80.00, '["user-research", "prototyping", "design-systems", "accessibility"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement team  
('tm000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'David Thompson', 'Security Architect', 'david.thompson@company.com', 'Security', 40, 120.00, '["security-architecture", "penetration-testing", "compliance", "encryption"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000002-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440002', 'Lisa Wang', 'Full Stack Developer', 'lisa.wang@company.com', 'Engineering', 40, 92.00, '["react", "java", "spring-boot", "security"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000002-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440002', 'Carlos Martinez', 'DevOps Engineer', 'carlos.martinez@company.com', 'Infrastructure', 40, 100.00, '["kubernetes", "aws", "ci-cd", "monitoring"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics team (completed project)
('tm000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Jennifer Lee', 'Data Scientist', 'jennifer.lee@company.com', 'Data Science', 40, 95.00, '["python", "machine-learning", "data-visualization", "statistics"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000003-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440003', 'Thomas Brown', 'Frontend Developer', 'thomas.brown@company.com', 'Engineering', 40, 85.00, '["react", "d3.js", "data-visualization", "responsive-design"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration team
('tm000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'Dr. Patricia Davis', 'Healthcare Data Architect', 'patricia.davis@company.com', 'Healthcare IT', 40, 110.00, '["healthcare-standards", "hl7-fhir", "data-integration", "compliance"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tm000004-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440004', 'Kevin Zhang', 'Data Engineer', 'kevin.zhang@company.com', 'Data Engineering', 40, 98.00, '["python", "etl-pipelines", "kafka", "real-time-processing"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create project milestones
INSERT INTO project_milestones (id, project_id, title, description, due_date, status, progress, created_by) VALUES 
-- CRM Mobile Optimization milestones
('ms000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Requirements Gathering', 'Analyze current CRM usage patterns and mobile optimization needs', '2024-03-15', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000001-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440001', 'Mobile UI/UX Design', 'Design responsive mobile interface and user experience', '2024-04-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000001-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440001', 'Backend API Development', 'Develop mobile-optimized APIs and data synchronization', '2024-06-15', 'in_progress', 70, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000001-e29b-41d4-a716-446655440004', 'abc12345-e29b-41d4-a716-446655440001', 'Mobile App Development', 'Build native and progressive web app versions', '2024-08-15', 'in_progress', 45, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement milestones
('ms000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'Security Assessment', 'Comprehensive security audit and vulnerability assessment', '2024-02-28', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000002-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440002', 'Multi-Factor Authentication', 'Implement advanced MFA and biometric authentication', '2024-04-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000002-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440002', 'Fraud Detection System', 'Build AI-powered fraud detection and prevention system', '2024-06-30', 'in_progress', 85, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000002-e29b-41d4-a716-446655440004', 'abc12345-e29b-41d4-a716-446655440002', 'Compliance Certification', 'Achieve SOC 2 Type II and PCI DSS compliance', '2024-07-15', 'in_progress', 60, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics milestones (completed)
('ms000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Data Pipeline Setup', 'Create data ingestion and processing pipeline for learning analytics', '2023-11-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000003-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440003', 'Analytics Dashboard', 'Build interactive dashboard for learning insights and performance metrics', '2024-01-31', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000003-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440003', 'Predictive Analytics', 'Implement ML models for student performance prediction', '2024-02-28', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration milestones 
('ms000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'Standards Assessment', 'Evaluate healthcare data standards and integration requirements', '2024-08-15', 'pending', 0, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ms000004-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440004', 'Data Source Integration', 'Connect and integrate multiple healthcare data sources', '2024-10-31', 'pending', 0, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create project tasks with realistic completion and progress data
INSERT INTO project_tasks (id, milestone_id, title, description, status, priority, progress, due_date, estimated_effort_hours, owner_id, owner_type, points, created_by) VALUES 
-- CRM Mobile Optimization tasks
('tk000001-e29b-41d4-a716-446655440001', 'ms000001-e29b-41d4-a716-446655440003', 'API Performance Optimization', 'Optimize API response times for mobile devices', 'completed', 'high', 100, '2024-05-15', 32.0, 'tm000001-e29b-41d4-a716-446655440003', 'stakeholder', 5, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tk000001-e29b-41d4-a716-446655440002', 'ms000001-e29b-41d4-a716-446655440003', 'Offline Data Sync', 'Implement offline data synchronization capabilities', 'in_progress', 'medium', 60, '2024-06-10', 48.0, 'tm000001-e29b-41d4-a716-446655440003', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tk000001-e29b-41d4-a716-446655440003', 'ms000001-e29b-41d4-a716-446655440004', 'React Native App', 'Develop React Native mobile application', 'in_progress', 'high', 40, '2024-07-30', 120.0, 'tm000001-e29b-41d4-a716-446655440002', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement tasks
('tk000002-e29b-41d4-a716-446655440001', 'ms000002-e29b-41d4-a716-446655440003', 'Machine Learning Model', 'Develop and train fraud detection ML models', 'completed', 'critical', 100, '2024-05-30', 80.0, 'tm000002-e29b-41d4-a716-446655440001', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tk000002-e29b-41d4-a716-446655440002', 'ms000002-e29b-41d4-a716-446655440003', 'Real-time Monitoring', 'Implement real-time transaction monitoring system', 'in_progress', 'high', 75, '2024-06-15', 60.0, 'tm000002-e29b-41d4-a716-446655440002', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tk000002-e29b-41d4-a716-446655440003', 'ms000002-e29b-41d4-a716-446655440004', 'Compliance Documentation', 'Prepare documentation for SOC 2 audit', 'in_progress', 'medium', 50, '2024-07-01', 40.0, 'tm000002-e29b-41d4-a716-446655440001', 'stakeholder', 5, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics tasks (completed)
('tk000003-e29b-41d4-a716-446655440001', 'ms000003-e29b-41d4-a716-446655440002', 'Interactive Dashboards', 'Build responsive analytics dashboards', 'completed', 'high', 100, '2024-01-20', 56.0, 'tm000003-e29b-41d4-a716-446655440002', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('tk000003-e29b-41d4-a716-446655440002', 'ms000003-e29b-41d4-a716-446655440003', 'Predictive Models', 'Implement student performance prediction algorithms', 'completed', 'medium', 100, '2024-02-15', 72.0, 'tm000003-e29b-41d4-a716-446655440001', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create budget items
INSERT INTO project_budget_items (id, project_id, item_name, category, planned_amount, actual_amount, description, date_incurred, created_by) VALUES 
-- CRM Mobile Optimization budget
('bi000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Development Team', 'personnel', 220000.00, 145000.00, 'Mobile development team salaries and contractors', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000001-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440001', 'Cloud Infrastructure', 'infrastructure', 35000.00, 22000.00, 'AWS services and CDN costs', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000001-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440001', 'Mobile Development Tools', 'software', 25000.00, 18000.00, 'React Native and testing tools licenses', '2024-03-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement budget
('bi000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'Security Team', 'personnel', 180000.00, 144000.00, 'Security specialists and consultants', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000002-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440002', 'Security Tools & Licenses', 'software', 45000.00, 38000.00, 'Penetration testing and security monitoring tools', '2024-04-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000002-e29b-41d4-a716-446655440003', 'abc12345-e29b-41d4-a716-446655440002', 'Compliance Audit', 'consulting', 35000.00, 15000.00, 'External audit and compliance certification costs', '2024-05-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics budget (completed)
('bi000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Data Science Team', 'personnel', 95000.00, 92000.00, 'Data scientists and analysts', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000003-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440003', 'Analytics Platform', 'software', 35000.00, 33000.00, 'Business intelligence and visualization tools', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration budget
('bi000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'Healthcare IT Team', 'personnel', 250000.00, 18000.00, 'Healthcare data specialists and integration team', '2024-07-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('bi000004-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440004', 'FHIR Integration Platform', 'software', 85000.00, 0.00, 'Healthcare data integration platform licensing', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create project risks
INSERT INTO project_risks (id, project_id, title, description, category, probability, impact, severity_level, status, mitigation_strategy, assigned_to, risk_owner, due_date, resolution_date, created_by) VALUES 
-- CRM Mobile Optimization risks
('ri000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Cross-Platform Compatibility', 'Potential issues with app performance across different mobile platforms', 'technical', 'medium', 'medium', 'medium', 'open', 'Extensive testing on all target platforms and devices', 'tm000001-e29b-41d4-a716-446655440002', 'tm000001-e29b-41d4-a716-446655440001', '2024-07-31', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ri000001-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440001', 'Data Synchronization Complexity', 'Risk of data conflicts during offline/online synchronization', 'technical', 'high', 'high', 'high', 'mitigated', 'Implement robust conflict resolution algorithms and user feedback mechanisms', 'tm000001-e29b-41d4-a716-446655440003', 'tm000001-e29b-41d4-a716-446655440003', '2024-06-15', '2024-05-20', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement risks
('ri000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'Regulatory Changes', 'Potential changes in financial regulations affecting security requirements', 'compliance', 'medium', 'high', 'high', 'open', 'Regular monitoring of regulatory updates and flexible architecture design', 'tm000002-e29b-41d4-a716-446655440001', 'tm000002-e29b-41d4-a716-446655440001', '2024-07-15', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('ri000002-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440002', 'False Positive Rates', 'High false positive rates in fraud detection could impact user experience', 'operational', 'high', 'medium', 'medium', 'open', 'Continuous model tuning and user feedback integration', 'tm000002-e29b-41d4-a716-446655440001', 'tm000002-e29b-41d4-a716-446655440001', '2024-06-30', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics risks (resolved)
('ri000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Privacy Compliance', 'Student data privacy concerns and FERPA compliance requirements', 'compliance', 'medium', 'high', 'high', 'resolved', 'Implemented comprehensive data anonymization and access controls', 'tm000003-e29b-41d4-a716-446655440001', 'tm000003-e29b-41d4-a716-446655440001', '2024-01-15', '2024-01-10', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration risks
('ri000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'HIPAA Compliance', 'Ensuring all healthcare data integration meets HIPAA requirements', 'compliance', 'high', 'critical', 'critical', 'open', 'Engage healthcare compliance experts and implement robust security measures', 'tm000004-e29b-41d4-a716-446655440001', 'tm000004-e29b-41d4-a716-446655440001', '2024-08-31', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create stakeholders
INSERT INTO project_stakeholders (id, project_id, name, role, email, department, influence_level, raci_role, is_internal, contact_info, notes, created_by) VALUES 
-- CRM Mobile Optimization stakeholders
('st000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Robert Anderson', 'VP of Sales', 'robert.anderson@company.com', 'Sales', 'high', 'accountable', true, '{"phone": "+1-555-0101", "office": "Building A, Floor 5"}', 'Primary sponsor and decision maker for CRM enhancements', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('st000001-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440001', 'Maria Garcia', 'Sales Operations Manager', 'maria.garcia@company.com', 'Sales Operations', 'high', 'consulted', true, '{"phone": "+1-555-0102", "office": "Building B, Floor 3"}', 'Provides operational requirements and user feedback', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement stakeholders
('st000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'James Wilson', 'Chief Security Officer', 'james.wilson@company.com', 'Security', 'high', 'responsible', true, '{"phone": "+1-555-0103", "office": "Building A, Floor 2"}', 'Oversees all security initiatives and compliance', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('st000002-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440002', 'Susan Chen', 'Compliance Officer', 'susan.chen@company.com', 'Legal & Compliance', 'high', 'consulted', true, '{"phone": "+1-555-0104", "office": "Building A, Floor 4"}', 'Ensures regulatory compliance and audit readiness', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics stakeholders
('st000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Dr. Patricia Davis', 'VP of Education Technology', 'patricia.davis@company.com', 'Education', 'high', 'accountable', true, '{"phone": "+1-555-0105", "office": "Building C, Floor 2"}', 'Educational technology strategy and implementation', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration stakeholders
('st000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'Dr. Michael Brown', 'Chief Medical Officer', 'michael.brown@company.com', 'Medical Affairs', 'high', 'accountable', true, '{"phone": "+1-555-0106", "office": "Building D, Floor 1"}', 'Clinical oversight and healthcare standards compliance', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),
('st000004-e29b-41d4-a716-446655440002', 'abc12345-e29b-41d4-a716-446655440004', 'Lisa Thompson', 'Healthcare IT Director', 'lisa.thompson@company.com', 'Healthcare IT', 'high', 'responsible', true, '{"phone": "+1-555-0107", "office": "Building E, Floor 3"}', 'Technical implementation and system integration', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));

-- Create project status updates
INSERT INTO project_status_updates (id, project_id, summary, achievements, challenges, next_steps, progress_percentage, milestone_reached, budget_spent, update_date, updated_by) VALUES 
-- CRM Mobile Optimization updates
('su000001-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440001', 'Mobile API optimization completed successfully', 'API response times improved by 60%. Offline sync architecture designed and partially implemented.', 'Cross-platform testing revealing some performance inconsistencies on older Android devices.', 'Complete offline sync implementation and begin React Native app development.', 65, 'Backend API Development', 185000.00, '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Banking Security Enhancement updates  
('su000002-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440002', 'Fraud detection system showing excellent results', 'ML models achieving 99.2% accuracy with only 0.3% false positive rate. Real-time monitoring dashboard operational.', 'SOC 2 audit preparation taking longer than expected due to documentation requirements.', 'Finalize compliance documentation and begin final security testing phase.', 80, 'Fraud Detection System', 197000.00, '2024-06-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- E-Learning Analytics updates (final)
('su000003-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440003', 'Analytics platform successfully deployed', 'All learning analytics features implemented and deployed. Predictive models showing 87% accuracy in performance prediction.', 'Initial user adoption slower than expected, requiring additional training materials.', 'Project complete. Transition to maintenance mode with quarterly feature updates.', 100, 'Predictive Analytics', 125000.00, '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000')),

-- Healthcare Data Integration updates
('su000004-e29b-41d4-a716-446655440001', 'abc12345-e29b-41d4-a716-446655440004', 'Project planning and initial assessment underway', 'Healthcare standards assessment completed. Initial team assembled and requirements gathering started.', 'Complexity of HIPAA compliance requirements higher than initially estimated.', 'Complete detailed technical architecture design and begin pilot integration testing.', 15, 'Standards Assessment', 18000.00, '2024-07-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'));