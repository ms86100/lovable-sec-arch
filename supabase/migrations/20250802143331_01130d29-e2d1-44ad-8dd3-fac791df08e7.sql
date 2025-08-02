-- Create dummy products first (using a placeholder UUID that should be replaced when a real user is logged in)
INSERT INTO products (id, name, description, owner_id, tags) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Mobile Banking App', 'Next-generation mobile banking application', '00000000-0000-0000-0000-000000000000', ARRAY['fintech', 'mobile', 'banking']),
('550e8400-e29b-41d4-a716-446655440002', 'E-Commerce Platform', 'Modern e-commerce platform with AI recommendations', '00000000-0000-0000-0000-000000000000', ARRAY['e-commerce', 'ai', 'retail']),
('550e8400-e29b-41d4-a716-446655440003', 'IoT Analytics Dashboard', 'Real-time IoT data analytics and visualization', '00000000-0000-0000-0000-000000000000', ARRAY['iot', 'analytics', 'dashboard']);

-- Create dummy projects
INSERT INTO projects (id, product_id, name, description, status, priority, budget, progress, start_date, end_date, assigned_to, created_by) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Mobile Banking App v2.0', 'Complete redesign of mobile banking application with enhanced security features', 'active', 'high', 450000.00, 75, '2024-01-15', '2024-08-15', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'E-Commerce Platform MVP', 'Minimum viable product for the new e-commerce platform', 'active', 'high', 320000.00, 60, '2024-02-01', '2024-07-31', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'IoT Dashboard Phase 1', 'Initial implementation of IoT analytics dashboard', 'completed', 'medium', 180000.00, 100, '2023-10-01', '2024-01-31', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Mobile Banking Security Audit', 'Comprehensive security assessment and compliance review', 'planning', 'critical', 75000.00, 25, '2024-06-01', '2024-09-30', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');

-- Create team members
INSERT INTO project_team_members (id, project_id, name, role, email, department, availability_hours, hourly_rate, skills, created_by) VALUES 
-- Mobile Banking App team
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'Project Manager', 'sarah.johnson@company.com', 'Engineering', 40, 85.00, '["project-management", "agile", "stakeholder-communication"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Mike Chen', 'Senior Frontend Developer', 'mike.chen@company.com', 'Engineering', 40, 95.00, '["react", "typescript", "mobile-development", "ui-ux"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Emily Rodriguez', 'Backend Developer', 'emily.rodriguez@company.com', 'Engineering', 35, 90.00, '["node.js", "postgresql", "api-design", "security"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Alex Kim', 'DevOps Engineer', 'alex.kim@company.com', 'Infrastructure', 40, 100.00, '["aws", "kubernetes", "ci-cd", "monitoring"]', '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform team
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'David Thompson', 'Tech Lead', 'david.thompson@company.com', 'Engineering', 40, 110.00, '["architecture", "microservices", "team-leadership", "scalability"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Lisa Wang', 'UX Designer', 'lisa.wang@company.com', 'Design', 35, 80.00, '["user-research", "wireframing", "prototyping", "design-systems"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Carlos Martinez', 'Full Stack Developer', 'carlos.martinez@company.com', 'Engineering', 40, 88.00, '["react", "python", "django", "database-design"]', '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard team
('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Jennifer Lee', 'Data Engineer', 'jennifer.lee@company.com', 'Data Science', 40, 92.00, '["python", "data-pipeline", "real-time-processing", "visualization"]', '00000000-0000-0000-0000-000000000000'),
('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Thomas Brown', 'Frontend Developer', 'thomas.brown@company.com', 'Engineering', 40, 85.00, '["react", "d3.js", "data-visualization", "responsive-design"]', '00000000-0000-0000-0000-000000000000');

-- Create project milestones
INSERT INTO project_milestones (id, project_id, title, description, due_date, status, progress, created_by) VALUES 
-- Mobile Banking App milestones
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Requirements Analysis', 'Complete business requirements and technical specifications', '2024-02-15', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'UI/UX Design', 'Complete user interface and user experience design', '2024-03-31', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Backend Development', 'Core API development and database design', '2024-05-31', 'in_progress', 85, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Mobile App Development', 'iOS and Android app development', '2024-07-15', 'in_progress', 70, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', 'Security Testing', 'Comprehensive security testing and penetration testing', '2024-08-01', 'pending', 0, '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform milestones
('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Market Research', 'Competitive analysis and feature prioritization', '2024-02-28', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Platform Architecture', 'System architecture and technology stack selection', '2024-03-31', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440002', 'Core Features Development', 'Product catalog, shopping cart, and payment integration', '2024-06-30', 'in_progress', 65, '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard milestones (completed project)
('880e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Data Pipeline Setup', 'Real-time data ingestion and processing pipeline', '2023-11-30', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440003', 'Dashboard Development', 'Interactive dashboard with real-time visualizations', '2024-01-15', 'completed', 100, '00000000-0000-0000-0000-000000000000'),
('880e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440003', 'Testing & Deployment', 'User acceptance testing and production deployment', '2024-01-31', 'completed', 100, '00000000-0000-0000-0000-000000000000');

-- Create project tasks
INSERT INTO project_tasks (id, milestone_id, title, description, status, priority, progress, due_date, estimated_effort_hours, owner_id, owner_type, points, created_by) VALUES 
-- Tasks for Mobile Banking App
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440003', 'API Authentication System', 'Implement OAuth 2.0 and JWT token management', 'completed', 'high', 100, '2024-04-15', 40.0, '770e8400-e29b-41d4-a716-446655440003', 'stakeholder', 8, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', 'Payment Processing Integration', 'Integrate with multiple payment gateways', 'in_progress', 'critical', 75, '2024-05-20', 60.0, '770e8400-e29b-41d4-a716-446655440003', 'stakeholder', 13, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', 'Mobile UI Components', 'Build reusable UI component library', 'in_progress', 'medium', 80, '2024-06-01', 35.0, '770e8400-e29b-41d4-a716-446655440002', 'stakeholder', 5, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'Account Management Features', 'Account balance, transaction history, transfers', 'completed', 'high', 100, '2024-05-15', 50.0, '770e8400-e29b-41d4-a716-446655440002', 'stakeholder', 8, '00000000-0000-0000-0000-000000000000'),

-- Tasks for E-Commerce Platform
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440008', 'Product Catalog System', 'Product management and search functionality', 'completed', 'high', 100, '2024-04-30', 45.0, '770e8400-e29b-41d4-a716-446655440007', 'stakeholder', 8, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440006', '880e8400-e29b-41d4-a716-446655440008', 'Shopping Cart & Checkout', 'Cart management and checkout process', 'in_progress', 'high', 60, '2024-06-15', 40.0, '770e8400-e29b-41d4-a716-446655440007', 'stakeholder', 8, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440007', '880e8400-e29b-41d4-a716-446655440008', 'User Experience Optimization', 'A/B testing and conversion optimization', 'pending', 'medium', 0, '2024-07-01', 30.0, '770e8400-e29b-41d4-a716-446655440006', 'stakeholder', 5, '00000000-0000-0000-0000-000000000000'),

-- Tasks for IoT Dashboard (completed)
('990e8400-e29b-41d4-a716-446655440008', '880e8400-e29b-41d4-a716-446655440010', 'Real-time Data Visualization', 'Interactive charts and graphs for IoT data', 'completed', 'high', 100, '2024-01-10', 55.0, '770e8400-e29b-41d4-a716-446655440009', 'stakeholder', 8, '00000000-0000-0000-0000-000000000000'),
('990e8400-e29b-41d4-a716-446655440009', '880e8400-e29b-41d4-a716-446655440010', 'Alert and Notification System', 'Automated alerts for threshold breaches', 'completed', 'medium', 100, '2024-01-05', 25.0, '770e8400-e29b-41d4-a716-446655440008', 'stakeholder', 5, '00000000-0000-0000-0000-000000000000');

-- Create budget items
INSERT INTO project_budget_items (id, project_id, item_name, category, planned_amount, actual_amount, description, date_incurred, created_by) VALUES 
-- Mobile Banking App budget
('aa0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Development Team Salaries', 'personnel', 280000.00, 210000.00, 'Salaries for development team members', '2024-05-01', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Cloud Infrastructure', 'infrastructure', 45000.00, 32000.00, 'AWS hosting and services', '2024-05-01', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Third-party Licenses', 'software', 35000.00, 28000.00, 'Security and payment processing licenses', '2024-03-15', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'Security Audit', 'consulting', 25000.00, 0.00, 'External security assessment', NULL, '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform budget
('aa0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Development Resources', 'personnel', 200000.00, 120000.00, 'Development team compensation', '2024-05-01', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Design & UX Research', 'consulting', 40000.00, 25000.00, 'User research and design services', '2024-04-01', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', 'Payment Gateway Setup', 'software', 15000.00, 12000.00, 'Payment processing integration costs', '2024-04-15', '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard budget (completed)
('aa0e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Data Engineering Team', 'personnel', 120000.00, 118000.00, 'Data pipeline development team', '2024-01-31', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Data Storage & Processing', 'infrastructure', 35000.00, 32000.00, 'Cloud data processing and storage', '2024-01-31', '00000000-0000-0000-0000-000000000000'),
('aa0e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440003', 'Visualization Tools', 'software', 25000.00, 24000.00, 'Dashboard and charting libraries', '2024-01-15', '00000000-0000-0000-0000-000000000000');

-- Create project risks
INSERT INTO project_risks (id, project_id, title, description, category, probability, impact, severity_level, status, mitigation_strategy, assigned_to, risk_owner, due_date, resolution_date, created_by) VALUES 
-- Mobile Banking App risks
('bb0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Regulatory Compliance Delays', 'Potential delays due to changing financial regulations', 'compliance', 'medium', 'high', 'high', 'open', 'Engage compliance team early and maintain regular communication with regulators', '770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '2024-06-30', NULL, '00000000-0000-0000-0000-000000000000'),
('bb0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Third-party API Dependencies', 'Risk of payment gateway API changes or downtime', 'technical', 'low', 'medium', 'medium', 'mitigated', 'Implement multiple payment providers and robust error handling', '770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440003', '2024-05-15', '2024-04-20', '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform risks
('bb0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Market Competition', 'Increased competition from established e-commerce platforms', 'business', 'high', 'medium', 'medium', 'open', 'Focus on unique value propositions and rapid feature development', '770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '2024-07-31', NULL, '00000000-0000-0000-0000-000000000000'),
('bb0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Scalability Challenges', 'Potential performance issues during peak traffic', 'technical', 'medium', 'high', 'high', 'open', 'Implement load testing and auto-scaling infrastructure', '770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440005', '2024-06-30', NULL, '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard risks (resolved)
('bb0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'Data Quality Issues', 'Inconsistent or unreliable IoT sensor data', 'operational', 'medium', 'medium', 'medium', 'resolved', 'Implemented data validation and cleansing pipeline', '770e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440008', '2023-12-15', '2023-12-10', '00000000-0000-0000-0000-000000000000'),
('bb0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Real-time Processing Latency', 'Delays in real-time data processing and visualization', 'technical', 'low', 'medium', 'low', 'resolved', 'Optimized data pipeline and implemented caching strategies', '770e8400-e29b-41d4-a716-446655440008', '770e8400-e29b-41d4-a716-446655440008', '2023-12-31', '2023-12-20', '00000000-0000-0000-0000-000000000000');

-- Create stakeholders
INSERT INTO project_stakeholders (id, project_id, name, role, email, department, influence_level, raci_role, is_internal, contact_info, notes, created_by) VALUES 
-- Mobile Banking App stakeholders
('cc0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Robert Anderson', 'VP of Technology', 'robert.anderson@company.com', 'Technology', 'high', 'accountable', true, '{"phone": "+1-555-0101", "office": "Building A, Floor 5"}', 'Final decision maker for technical architecture', '00000000-0000-0000-0000-000000000000'),
('cc0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Maria Garcia', 'Compliance Officer', 'maria.garcia@company.com', 'Legal & Compliance', 'high', 'consulted', true, '{"phone": "+1-555-0102", "office": "Building B, Floor 3"}', 'Ensures regulatory compliance for financial services', '00000000-0000-0000-0000-000000000000'),
('cc0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'James Wilson', 'Head of Customer Experience', 'james.wilson@company.com', 'Customer Success', 'medium', 'informed', true, '{"phone": "+1-555-0103", "office": "Building A, Floor 2"}', 'Represents customer needs and feedback', '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform stakeholders
('cc0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Susan Chen', 'Product Owner', 'susan.chen@company.com', 'Product Management', 'high', 'responsible', true, '{"phone": "+1-555-0104", "office": "Building A, Floor 4"}', 'Defines product requirements and priorities', '00000000-0000-0000-0000-000000000000'),
('cc0e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Michael Brown', 'Marketing Director', 'michael.brown@company.com', 'Marketing', 'medium', 'informed', true, '{"phone": "+1-555-0105", "office": "Building C, Floor 2"}', 'Coordinates go-to-market strategy', '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard stakeholders
('cc0e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Dr. Patricia Davis', 'Chief Data Officer', 'patricia.davis@company.com', 'Data Science', 'high', 'accountable', true, '{"phone": "+1-555-0106", "office": "Building D, Floor 1"}', 'Oversees all data initiatives and strategy', '00000000-0000-0000-0000-000000000000'),
('cc0e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'Kevin Zhang', 'Operations Manager', 'kevin.zhang@company.com', 'Operations', 'medium', 'consulted', true, '{"phone": "+1-555-0107", "office": "Building E, Floor 3"}', 'End user of the IoT analytics dashboard', '00000000-0000-0000-0000-000000000000');

-- Create project status updates
INSERT INTO project_status_updates (id, project_id, summary, achievements, challenges, next_steps, progress_percentage, milestone_reached, budget_spent, update_date, updated_by) VALUES 
-- Mobile Banking App updates
('dd0e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Backend API development completed ahead of schedule', 'Successfully implemented authentication system and payment processing APIs. All security requirements met.', 'Minor delays in third-party payment gateway integration due to documentation issues.', 'Begin mobile app development and start security testing preparations.', 75, 'Backend Development', 270000.00, '2024-05-15', '00000000-0000-0000-0000-000000000000'),
('dd0e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Mobile UI development progressing well', 'UI component library 80% complete. User testing feedback incorporated into design.', 'Performance optimization needed for older mobile devices.', 'Complete mobile UI components and begin integration testing.', 70, 'Mobile App Development', 270000.00, '2024-06-01', '00000000-0000-0000-0000-000000000000'),

-- E-Commerce Platform updates
('dd0e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Core platform features taking shape', 'Product catalog system fully functional. Shopping cart implementation 60% complete.', 'Performance concerns with large product catalogs. Need to optimize search functionality.', 'Complete shopping cart features and begin payment integration testing.', 60, 'Core Features Development', 157000.00, '2024-05-20', '00000000-0000-0000-0000-000000000000'),

-- IoT Dashboard updates (final update)
('dd0e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Project successfully completed and deployed', 'All milestones achieved on time. Dashboard deployed to production with 99.9% uptime.', 'Minor data quality issues resolved through enhanced validation pipeline.', 'Project complete. Transitioning to maintenance mode with monthly reviews.', 100, 'Testing & Deployment', 174000.00, '2024-01-31', '00000000-0000-0000-0000-000000000000');

-- Update the owner_id to the current user for existing users
UPDATE products SET owner_id = COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000') WHERE owner_id = '00000000-0000-0000-0000-000000000000';
UPDATE projects SET assigned_to = COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'), created_by = COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000') WHERE created_by = '00000000-0000-0000-0000-000000000000';