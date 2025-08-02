import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface SpendingItem {
  id: string
  category: string
  item_name: string
  description: string | null
  actual_amount: number
  quotation_link: string | null
  rfq_rom_link: string | null
  date_incurred: string | null
  created_at: string
}

interface BudgetSpendingProps {
  projectId: string
  readOnly?: boolean
}

export function BudgetSpending({ projectId, readOnly = false }: BudgetSpendingProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [spendingItems, setSpendingItems] = useState<SpendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SpendingItem | null>(null)

  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    description: '',
    actual_amount: 0,
    quotation_link: '',
    rfq_rom_link: '',
    date_incurred: format(new Date(), 'yyyy-MM-dd')
  })

  useEffect(() => {
    fetchSpendingItems()
  }, [projectId])

  const fetchSpendingItems = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('project_budget_items')
        .select('*')
        .eq('project_id', projectId)
        .not('actual_amount', 'is', null)
        .gt('actual_amount', 0)
        .order('date_incurred', { ascending: false })

      if (error) throw error

      setSpendingItems(data || [])
    } catch (error: any) {
      console.error('Error fetching spending items:', error)
      toast({
        title: "Error",
        description: "Failed to load spending information",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category: '',
      item_name: '',
      description: '',
      actual_amount: 0,
      quotation_link: '',
      rfq_rom_link: '',
      date_incurred: format(new Date(), 'yyyy-MM-dd')
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: SpendingItem) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      item_name: item.item_name,
      description: item.description || '',
      actual_amount: item.actual_amount,
      quotation_link: item.quotation_link || '',
      rfq_rom_link: item.rfq_rom_link || '',
      date_incurred: item.date_incurred || format(new Date(), 'yyyy-MM-dd')
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const spendingData = {
        project_id: projectId,
        category: formData.category,
        item_name: formData.item_name,
        description: formData.description || null,
        planned_amount: 0,
        actual_amount: formData.actual_amount,
        quotation_link: formData.quotation_link || null,
        rfq_rom_link: formData.rfq_rom_link || null,
        date_incurred: formData.date_incurred,
        created_by: user?.id,
        updated_by: user?.id
      }

      if (editingItem) {
        const { error } = await supabase
          .from('project_budget_items')
          .update(spendingData)
          .eq('id', editingItem.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Spending item updated successfully"
        })
      } else {
        const { error } = await supabase
          .from('project_budget_items')
          .insert(spendingData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Spending item added successfully"
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchSpendingItems()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this spending item?')) return

    try {
      const { error } = await supabase
        .from('project_budget_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Spending item deleted successfully"
      })

      fetchSpendingItems()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted rounded w-3/4"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Spending Information & Attachments</CardTitle>
            <CardDescription>
              Track actual spending with quotations and RFQ/ROM links
            </CardDescription>
          </div>
          {!readOnly && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setDialogOpen(true) }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Spending
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Spending Item' : 'Add New Spending Item'}
                  </DialogTitle>
                  <DialogDescription>
                    Record actual spending with supporting documentation
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g., Development, Marketing"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount Spent *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.actual_amount}
                        onChange={(e) => setFormData({...formData, actual_amount: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item_name">Item Name *</Label>
                    <Input
                      id="item_name"
                      value={formData.item_name}
                      onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                      placeholder="Brief description of the expense"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Additional details about this expense"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quotation_link">Quotation Link</Label>
                      <Input
                        id="quotation_link"
                        type="url"
                        value={formData.quotation_link}
                        onChange={(e) => setFormData({...formData, quotation_link: e.target.value})}
                        placeholder="https://example.com/quotation.pdf"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rfq_rom_link">RFQ/ROM Link</Label>
                      <Input
                        id="rfq_rom_link"
                        type="url"
                        value={formData.rfq_rom_link}
                        onChange={(e) => setFormData({...formData, rfq_rom_link: e.target.value})}
                        placeholder="https://example.com/rfq.pdf"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_incurred">Date Incurred</Label>
                    <Input
                      id="date_incurred"
                      type="date"
                      value={formData.date_incurred}
                      onChange={(e) => setFormData({...formData, date_incurred: e.target.value})}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingItem ? 'Update' : 'Add'} Spending Item
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {spendingItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No spending recorded</p>
            <p className="text-sm">Add spending items to track actual expenses</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount Spent</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quotation Link</TableHead>
                <TableHead>RFQ/ROM Link</TableHead>
                <TableHead>Date</TableHead>
                {!readOnly && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {spendingItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.category}</TableCell>
                  <TableCell>{formatCurrency(item.actual_amount)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.item_name}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.quotation_link ? (
                      <a 
                        href={item.quotation_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.rfq_rom_link ? (
                      <a 
                        href={item.rfq_rom_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.date_incurred 
                      ? format(new Date(item.date_incurred), 'MMM dd, yyyy')
                      : format(new Date(item.created_at), 'MMM dd, yyyy')
                    }
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}