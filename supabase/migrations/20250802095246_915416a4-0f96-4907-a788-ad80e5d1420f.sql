-- Add spending tracking to project budget items
ALTER TABLE public.project_budget_items 
ADD COLUMN IF NOT EXISTS quotation_link TEXT,
ADD COLUMN IF NOT EXISTS rfq_rom_link TEXT;

-- Add document URL to project documentation
ALTER TABLE public.project_documentation
ADD COLUMN IF NOT EXISTS document_url TEXT;