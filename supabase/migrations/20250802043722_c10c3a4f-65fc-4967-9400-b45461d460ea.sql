-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create projects table (belongs to products)
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date DATE,
  end_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget DECIMAL(15,2),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Users can view products they have access to" 
ON public.products 
FOR SELECT 
USING (
  -- Owner can view their products
  auth.uid() = owner_id OR
  -- Admins can view all products
  public.is_admin(auth.uid()) OR
  -- Managers can view all products
  public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Users can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (
  -- Managers and admins can create products
  public.has_role(auth.uid(), 'manager') OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Product owners and admins can update products" 
ON public.products 
FOR UPDATE 
USING (
  auth.uid() = owner_id OR 
  public.is_admin(auth.uid())
);

CREATE POLICY "Product owners and admins can delete products" 
ON public.products 
FOR DELETE 
USING (
  auth.uid() = owner_id OR 
  public.is_admin(auth.uid())
);

-- RLS Policies for projects
CREATE POLICY "Users can view projects in accessible products" 
ON public.projects 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = projects.product_id 
    AND (
      products.owner_id = auth.uid() OR
      public.is_admin(auth.uid()) OR
      public.has_role(auth.uid(), 'manager')
    )
  )
);

CREATE POLICY "Users can create projects in their products" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = projects.product_id 
    AND (
      products.owner_id = auth.uid() OR
      public.is_admin(auth.uid()) OR
      public.has_role(auth.uid(), 'manager')
    )
  )
);

CREATE POLICY "Users can update projects in their products" 
ON public.projects 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = projects.product_id 
    AND (
      products.owner_id = auth.uid() OR
      public.is_admin(auth.uid())
    )
  ) OR
  -- Assigned users can update progress
  auth.uid() = assigned_to
);

CREATE POLICY "Users can delete projects in their products" 
ON public.projects 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = projects.product_id 
    AND (
      products.owner_id = auth.uid() OR
      public.is_admin(auth.uid())
    )
  )
);

-- Create indexes for better performance
CREATE INDEX idx_products_owner ON public.products(owner_id);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_projects_product_id ON public.projects(product_id);
CREATE INDEX idx_projects_assigned_to ON public.projects(assigned_to);
CREATE INDEX idx_projects_status ON public.projects(status);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();