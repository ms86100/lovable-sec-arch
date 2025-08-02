import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ProductForm } from '@/components/ProductForm'
import { Plus, Edit, Trash2, Package, User, Calendar, FolderOpen } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Product {
  id: string
  name: string
  description: string | null
  owner_id: string
  tags: string[] | null
  created_at: string
  updated_at: string
  created_by: string | null
  updated_by: string | null
  project_count?: number
}

export default function Products() {
  const { user, hasRole } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const canCreateProducts = hasRole('manager') || hasRole('admin')
  const isAdmin = hasRole('admin')

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get project counts for each product
      const productsWithCounts = await Promise.all(
        (data || []).map(async (product) => {
          const { count } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', product.id)

          return {
            ...product,
            tags: product.tags || [],
            project_count: count || 0
          }
        })
      )

      setProducts(productsWithCounts)
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      toast({
        title: "Product Deleted",
        description: `${product.name} has been deleted successfully.`
      })
      
      fetchProducts()
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleFormSuccess = () => {
    setShowCreateDialog(false)
    setShowEditDialog(false)
    setSelectedProduct(undefined)
    fetchProducts()
  }

  const canEditProduct = (product: Product) => {
    return product.owner_id === user?.id || isAdmin
  }

  const canDeleteProduct = (product: Product) => {
    return product.owner_id === user?.id || isAdmin
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product portfolio</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product portfolio</p>
        </div>
        {canCreateProducts && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <ProductForm
                onSuccess={handleFormSuccess}
                onCancel={() => setShowCreateDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {product.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {product.description || 'No description available'}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  {canEditProduct(product) && (
                    <Dialog open={showEditDialog && selectedProduct?.id === product.id} onOpenChange={(open) => {
                      setShowEditDialog(open)
                      if (!open) setSelectedProduct(undefined)
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        {selectedProduct && (
                          <ProductForm
                            product={selectedProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={() => {
                              setShowEditDialog(false)
                              setSelectedProduct(undefined)
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                  {canDeleteProduct(product) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This will also delete all associated projects. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                {(product.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(product.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                       onClick={(e) => { e.stopPropagation(); navigate(`/projects?product=${product.id}`) }}>
                    <FolderOpen className="w-4 h-4" />
                    {product.project_count} projects
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Owner: {product.owner_id.slice(0, 8)}...
                  </div>
                </div>

                {/* Created date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Created {format(new Date(product.created_at), 'MMM dd, yyyy')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : canCreateProducts 
                ? 'Create your first product to get started'
                : 'Products will appear here when they are created'
            }
          </p>
          {!searchTerm && canCreateProducts && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Product
            </Button>
          )}
        </div>
      )}
    </div>
  )
}