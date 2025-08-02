-- Create comprehensive dummy data with proper UUIDs for the existing products
INSERT INTO projects (id, product_id, name, description, status, priority, budget, progress, start_date, end_date, assigned_to, created_by) VALUES 
('12345678-1234-1234-1234-123456789001', '550e8400-e29b-41d4-a716-446655440001', 'CRM Mobile Optimization', 'Optimize CRM platform for mobile devices and improve user experience', 'active', 'high', 350000.00, 65, '2024-02-01', '2024-08-31', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('12345678-1234-1234-1234-123456789002', '550e8400-e29b-41d4-a716-446655440002', 'Banking Security Enhancement', 'Implement advanced security features and compliance requirements', 'active', 'critical', 280000.00, 80, '2024-01-15', '2024-07-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('12345678-1234-1234-1234-123456789003', '550e8400-e29b-41d4-a716-446655440003', 'E-Learning Analytics Dashboard', 'Build comprehensive analytics and reporting dashboard', 'completed', 'medium', 150000.00, 100, '2023-09-01', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('12345678-1234-1234-1234-123456789004', '550e8400-e29b-41d4-a716-446655440004', 'Healthcare Data Integration', 'Integrate multiple healthcare data sources for comprehensive analytics', 'planning', 'high', 420000.00, 15, '2024-07-01', '2024-12-31', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'), COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));

-- Create team members for the projects with proper UUIDs
INSERT INTO project_team_members (id, project_id, name, role, email, department, availability_hours, hourly_rate, skills, created_by) VALUES 
-- CRM Mobile Optimization team
('22222222-2222-2222-2222-222222222001', '12345678-1234-1234-1234-123456789001', 'Sarah Johnson', 'Project Manager', 'sarah.johnson@company.com', 'Engineering', 40, 85.00, '["project-management", "agile", "stakeholder-communication"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222002', '12345678-1234-1234-1234-123456789001', 'Mike Chen', 'Senior Mobile Developer', 'mike.chen@company.com', 'Engineering', 40, 95.00, '["react-native", "ios", "android", "ui-ux"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222003', '12345678-1234-1234-1234-123456789001', 'Emily Rodriguez', 'Backend Developer', 'emily.rodriguez@company.com', 'Engineering', 35, 90.00, '["node.js", "postgresql", "api-design", "microservices"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222004', '12345678-1234-1234-1234-123456789001', 'Alex Kim', 'UX Designer', 'alex.kim@company.com', 'Design', 35, 80.00, '["user-research", "prototyping", "design-systems", "accessibility"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Banking Security Enhancement team  
('22222222-2222-2222-2222-222222222005', '12345678-1234-1234-1234-123456789002', 'David Thompson', 'Security Architect', 'david.thompson@company.com', 'Security', 40, 120.00, '["security-architecture", "penetration-testing", "compliance", "encryption"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222006', '12345678-1234-1234-1234-123456789002', 'Lisa Wang', 'Full Stack Developer', 'lisa.wang@company.com', 'Engineering', 40, 92.00, '["react", "java", "spring-boot", "security"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222007', '12345678-1234-1234-1234-123456789002', 'Carlos Martinez', 'DevOps Engineer', 'carlos.martinez@company.com', 'Infrastructure', 40, 100.00, '["kubernetes", "aws", "ci-cd", "monitoring"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- E-Learning Analytics team (completed project)
('22222222-2222-2222-2222-222222222008', '12345678-1234-1234-1234-123456789003', 'Jennifer Lee', 'Data Scientist', 'jennifer.lee@company.com', 'Data Science', 40, 95.00, '["python", "machine-learning", "data-visualization", "statistics"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222009', '12345678-1234-1234-1234-123456789003', 'Thomas Brown', 'Frontend Developer', 'thomas.brown@company.com', 'Engineering', 40, 85.00, '["react", "d3.js", "data-visualization", "responsive-design"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Healthcare Data Integration team
('22222222-2222-2222-2222-222222222010', '12345678-1234-1234-1234-123456789004', 'Dr. Patricia Davis', 'Healthcare Data Architect', 'patricia.davis@company.com', 'Healthcare IT', 40, 110.00, '["healthcare-standards", "hl7-fhir", "data-integration", "compliance"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('22222222-2222-2222-2222-222222222011', '12345678-1234-1234-1234-123456789004', 'Kevin Zhang', 'Data Engineer', 'kevin.zhang@company.com', 'Data Engineering', 40, 98.00, '["python", "etl-pipelines", "kafka", "real-time-processing"]', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));

-- Create project milestones with proper UUIDs
INSERT INTO project_milestones (id, project_id, title, description, due_date, status, progress, created_by) VALUES 
-- CRM Mobile Optimization milestones
('33333333-3333-3333-3333-333333333001', '12345678-1234-1234-1234-123456789001', 'Requirements Gathering', 'Analyze current CRM usage patterns and mobile optimization needs', '2024-03-15', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333002', '12345678-1234-1234-1234-123456789001', 'Mobile UI/UX Design', 'Design responsive mobile interface and user experience', '2024-04-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333003', '12345678-1234-1234-1234-123456789001', 'Backend API Development', 'Develop mobile-optimized APIs and data synchronization', '2024-06-15', 'in_progress', 70, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333004', '12345678-1234-1234-1234-123456789001', 'Mobile App Development', 'Build native and progressive web app versions', '2024-08-15', 'in_progress', 45, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Banking Security Enhancement milestones
('33333333-3333-3333-3333-333333333005', '12345678-1234-1234-1234-123456789002', 'Security Assessment', 'Comprehensive security audit and vulnerability assessment', '2024-02-28', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333006', '12345678-1234-1234-1234-123456789002', 'Multi-Factor Authentication', 'Implement advanced MFA and biometric authentication', '2024-04-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333007', '12345678-1234-1234-1234-123456789002', 'Fraud Detection System', 'Build AI-powered fraud detection and prevention system', '2024-06-30', 'in_progress', 85, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333008', '12345678-1234-1234-1234-123456789002', 'Compliance Certification', 'Achieve SOC 2 Type II and PCI DSS compliance', '2024-07-15', 'in_progress', 60, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- E-Learning Analytics milestones (completed)
('33333333-3333-3333-3333-333333333009', '12345678-1234-1234-1234-123456789003', 'Data Pipeline Setup', 'Create data ingestion and processing pipeline for learning analytics', '2023-11-30', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333010', '12345678-1234-1234-1234-123456789003', 'Analytics Dashboard', 'Build interactive dashboard for learning insights and performance metrics', '2024-01-31', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333011', '12345678-1234-1234-1234-123456789003', 'Predictive Analytics', 'Implement ML models for student performance prediction', '2024-02-28', 'completed', 100, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Healthcare Data Integration milestones 
('33333333-3333-3333-3333-333333333012', '12345678-1234-1234-1234-123456789004', 'Standards Assessment', 'Evaluate healthcare data standards and integration requirements', '2024-08-15', 'pending', 0, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('33333333-3333-3333-3333-333333333013', '12345678-1234-1234-1234-123456789004', 'Data Source Integration', 'Connect and integrate multiple healthcare data sources', '2024-10-31', 'pending', 0, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));

-- Create project tasks with realistic completion and progress data
INSERT INTO project_tasks (id, milestone_id, title, description, status, priority, progress, due_date, estimated_effort_hours, owner_id, owner_type, points, created_by) VALUES 
-- CRM Mobile Optimization tasks
('44444444-4444-4444-4444-444444444001', '33333333-3333-3333-3333-333333333003', 'API Performance Optimization', 'Optimize API response times for mobile devices', 'completed', 'high', 100, '2024-05-15', 32.0, '22222222-2222-2222-2222-222222222003', 'stakeholder', 5, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('44444444-4444-4444-4444-444444444002', '33333333-3333-3333-3333-333333333003', 'Offline Data Sync', 'Implement offline data synchronization capabilities', 'in_progress', 'medium', 60, '2024-06-10', 48.0, '22222222-2222-2222-2222-222222222003', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('44444444-4444-4444-4444-444444444003', '33333333-3333-3333-3333-333333333004', 'React Native App', 'Develop React Native mobile application', 'in_progress', 'high', 40, '2024-07-30', 120.0, '22222222-2222-2222-2222-222222222002', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Banking Security Enhancement tasks
('44444444-4444-4444-4444-444444444004', '33333333-3333-3333-3333-333333333007', 'Machine Learning Model', 'Develop and train fraud detection ML models', 'completed', 'critical', 100, '2024-05-30', 80.0, '22222222-2222-2222-2222-222222222005', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('44444444-4444-4444-4444-444444444005', '33333333-3333-3333-3333-333333333007', 'Real-time Monitoring', 'Implement real-time transaction monitoring system', 'in_progress', 'high', 75, '2024-06-15', 60.0, '22222222-2222-2222-2222-222222222006', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('44444444-4444-4444-4444-444444444006', '33333333-3333-3333-3333-333333333008', 'Compliance Documentation', 'Prepare documentation for SOC 2 audit', 'in_progress', 'medium', 50, '2024-07-01', 40.0, '22222222-2222-2222-2222-222222222005', 'stakeholder', 5, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- E-Learning Analytics tasks (completed)
('44444444-4444-4444-4444-444444444007', '33333333-3333-3333-3333-333333333010', 'Interactive Dashboards', 'Build responsive analytics dashboards', 'completed', 'high', 100, '2024-01-20', 56.0, '22222222-2222-2222-2222-222222222009', 'stakeholder', 8, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('44444444-4444-4444-4444-444444444008', '33333333-3333-3333-3333-333333333011', 'Predictive Models', 'Implement student performance prediction algorithms', 'completed', 'medium', 100, '2024-02-15', 72.0, '22222222-2222-2222-2222-222222222008', 'stakeholder', 13, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));

-- Create budget items
INSERT INTO project_budget_items (id, project_id, item_name, category, planned_amount, actual_amount, description, date_incurred, created_by) VALUES 
-- CRM Mobile Optimization budget
('55555555-5555-5555-5555-555555555001', '12345678-1234-1234-1234-123456789001', 'Development Team', 'personnel', 220000.00, 145000.00, 'Mobile development team salaries and contractors', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555002', '12345678-1234-1234-1234-123456789001', 'Cloud Infrastructure', 'infrastructure', 35000.00, 22000.00, 'AWS services and CDN costs', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555003', '12345678-1234-1234-1234-123456789001', 'Mobile Development Tools', 'software', 25000.00, 18000.00, 'React Native and testing tools licenses', '2024-03-15', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Banking Security Enhancement budget
('55555555-5555-5555-5555-555555555004', '12345678-1234-1234-1234-123456789002', 'Security Team', 'personnel', 180000.00, 144000.00, 'Security specialists and consultants', '2024-06-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555005', '12345678-1234-1234-1234-123456789002', 'Security Tools & Licenses', 'software', 45000.00, 38000.00, 'Penetration testing and security monitoring tools', '2024-04-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555006', '12345678-1234-1234-1234-123456789002', 'Compliance Audit', 'consulting', 35000.00, 15000.00, 'External audit and compliance certification costs', '2024-05-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- E-Learning Analytics budget (completed)
('55555555-5555-5555-5555-555555555007', '12345678-1234-1234-1234-123456789003', 'Data Science Team', 'personnel', 95000.00, 92000.00, 'Data scientists and analysts', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555008', '12345678-1234-1234-1234-123456789003', 'Analytics Platform', 'software', 35000.00, 33000.00, 'Business intelligence and visualization tools', '2024-02-28', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Healthcare Data Integration budget
('55555555-5555-5555-5555-555555555009', '12345678-1234-1234-1234-123456789004', 'Healthcare IT Team', 'personnel', 250000.00, 18000.00, 'Healthcare data specialists and integration team', '2024-07-01', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('55555555-5555-5555-5555-555555555010', '12345678-1234-1234-1234-123456789004', 'FHIR Integration Platform', 'software', 85000.00, 0.00, 'Healthcare data integration platform licensing', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));

-- Create project risks
INSERT INTO project_risks (id, project_id, title, description, category, probability, impact, severity_level, status, mitigation_strategy, assigned_to, risk_owner, due_date, resolution_date, created_by) VALUES 
-- CRM Mobile Optimization risks
('66666666-6666-6666-6666-666666666001', '12345678-1234-1234-1234-123456789001', 'Cross-Platform Compatibility', 'Potential issues with app performance across different mobile platforms', 'technical', 'medium', 'medium', 'medium', 'open', 'Extensive testing on all target platforms and devices', '22222222-2222-2222-2222-222222222002', '22222222-2222-2222-2222-222222222001', '2024-07-31', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('66666666-6666-6666-6666-666666666002', '12345678-1234-1234-1234-123456789001', 'Data Synchronization Complexity', 'Risk of data conflicts during offline/online synchronization', 'technical', 'high', 'high', 'high', 'mitigated', 'Implement robust conflict resolution algorithms and user feedback mechanisms', '22222222-2222-2222-2222-222222222003', '22222222-2222-2222-2222-222222222003', '2024-06-15', '2024-05-20', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Banking Security Enhancement risks
('66666666-6666-6666-6666-666666666003', '12345678-1234-1234-1234-123456789002', 'Regulatory Changes', 'Potential changes in financial regulations affecting security requirements', 'compliance', 'medium', 'high', 'high', 'open', 'Regular monitoring of regulatory updates and flexible architecture design', '22222222-2222-2222-2222-222222222005', '22222222-2222-2222-2222-222222222005', '2024-07-15', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),
('66666666-6666-6666-6666-666666666004', '12345678-1234-1234-1234-123456789002', 'False Positive Rates', 'High false positive rates in fraud detection could impact user experience', 'operational', 'high', 'medium', 'medium', 'open', 'Continuous model tuning and user feedback integration', '22222222-2222-2222-2222-222222222005', '22222222-2222-2222-2222-222222222005', '2024-06-30', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- E-Learning Analytics risks (resolved)
('66666666-6666-6666-6666-666666666005', '12345678-1234-1234-1234-123456789003', 'Privacy Compliance', 'Student data privacy concerns and FERPA compliance requirements', 'compliance', 'medium', 'high', 'high', 'resolved', 'Implemented comprehensive data anonymization and access controls', '22222222-2222-2222-2222-222222222008', '22222222-2222-2222-2222-222222222008', '2024-01-15', '2024-01-10', COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111')),

-- Healthcare Data Integration risks
('66666666-6666-6666-6666-666666666006', '12345678-1234-1234-1234-123456789004', 'HIPAA Compliance', 'Ensuring all healthcare data integration meets HIPAA requirements', 'compliance', 'high', 'critical', 'critical', 'open', 'Engage healthcare compliance experts and implement robust security measures', '22222222-2222-2222-2222-222222222010', '22222222-2222-2222-2222-222222222010', '2024-08-31', NULL, COALESCE((SELECT user_id FROM profiles LIMIT 1), '11111111-1111-1111-1111-111111111111'));