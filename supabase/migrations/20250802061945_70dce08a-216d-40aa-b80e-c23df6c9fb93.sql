-- Add the Advanced Security Platform project with comprehensive data
INSERT INTO projects (id, name, description, status, priority, progress, budget, start_date, end_date, product_id, assigned_to, created_by)
VALUES (
  '880e8400-e29b-41d4-a716-446655440010',
  'Advanced Security Platform',
  'Comprehensive security-first microservice architecture with advanced threat detection, real-time monitoring, and automated compliance reporting capabilities',
  'active',
  'critical',
  65,
  450000.00,
  '2024-01-01',
  '2024-12-31',
  '550e8400-e29b-41d4-a716-446655440001', -- Using existing product ID
  '45d29bef-57ec-4627-8cfc-7f3f7dc97cb4', -- Using existing user ID
  '45d29bef-57ec-4627-8cfc-7f3f7dc97cb4'
);