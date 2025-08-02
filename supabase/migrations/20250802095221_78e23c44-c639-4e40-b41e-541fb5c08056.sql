-- Add spending tracking to project budget items
ALTER TABLE public.project_budget_items 
ADD COLUMN quotation_link TEXT,
ADD COLUMN rfq_rom_link TEXT;

-- Update updated_at trigger
CREATE TRIGGER update_project_budget_items_updated_at
    BEFORE UPDATE ON public.project_budget_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add document URL to project documentation
ALTER TABLE public.project_documentation
ADD COLUMN document_url TEXT;