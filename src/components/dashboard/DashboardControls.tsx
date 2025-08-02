import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Grid3X3, 
  Grid2X2, 
  List, 
  Settings, 
  Save, 
  ChevronDown, 
  ChevronUp,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react'

interface DashboardControlsProps {
  viewMode: 'compact' | 'expanded'
  onViewModeChange: (mode: 'compact' | 'expanded') => void
  layoutMode: 'grid' | 'masonry' | 'list'
  onLayoutModeChange: (mode: 'grid' | 'masonry' | 'list') => void
  showGlobalData: boolean
  onShowGlobalDataChange: (show: boolean) => void
  selectedProductId: string
  onProductChange: (productId: string) => void
  selectedProjectId: string
  onProjectChange: (projectId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  products: Array<{ id: string; name: string }>
  projects: Array<{ id: string; name: string }>
}

export function DashboardControls({
  viewMode,
  onViewModeChange,
  layoutMode,
  onLayoutModeChange,
  showGlobalData,
  onShowGlobalDataChange,
  selectedProductId,
  onProductChange,
  selectedProjectId,
  onProjectChange,
  searchTerm,
  onSearchChange,
  products,
  projects
}: DashboardControlsProps) {
  const [isControlsExpanded, setIsControlsExpanded] = useState(false)

  const saveViewPreferences = () => {
    const preferences = {
      viewMode,
      layoutMode,
      showGlobalData,
      selectedProductId,
      selectedProjectId
    }
    localStorage.setItem('dashboardPreferences', JSON.stringify(preferences))
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Dashboard Controls</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveViewPreferences}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save View
            </Button>
            <Collapsible open={isControlsExpanded} onOpenChange={setIsControlsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  {isControlsExpanded ? 'Hide' : 'Show'} Controls
                  {isControlsExpanded ? (
                    <ChevronUp className="w-4 h-4 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Always visible basic controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'compact' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('compact')}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Compact
            </Button>
            <Button
              variant={viewMode === 'expanded' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('expanded')}
            >
              <Grid2X2 className="w-4 h-4 mr-2" />
              Expanded
            </Button>
          </div>

          {/* Global Data Toggle */}
          <Button
            variant={showGlobalData ? 'default' : 'outline'}
            size="sm"
            onClick={() => onShowGlobalDataChange(!showGlobalData)}
            className="flex items-center gap-2"
          >
            {showGlobalData ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Global Data
          </Button>

          {/* Active Filters Display */}
          {(selectedProductId !== 'all' || selectedProjectId !== 'all') && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {selectedProductId !== 'all' && (
                <Badge variant="secondary">
                  Product: {products.find(p => p.id === selectedProductId)?.name || 'Unknown'}
                </Badge>
              )}
              {selectedProjectId !== 'all' && (
                <Badge variant="secondary">
                  Project: {projects.find(p => p.id === selectedProjectId)?.name || 'Unknown'}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Collapsible advanced controls */}
        <Collapsible open={isControlsExpanded} onOpenChange={setIsControlsExpanded}>
          <CollapsibleContent className="space-y-4">
            {/* Layout Mode */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium min-w-fit">Layout:</span>
              <Button
                variant={layoutMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLayoutModeChange('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={layoutMode === 'masonry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLayoutModeChange('masonry')}
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>
              <Button
                variant={layoutMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onLayoutModeChange('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Filter</label>
                <Select value={selectedProductId} onValueChange={onProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Filter</label>
                <Select 
                  value={selectedProjectId} 
                  onValueChange={onProjectChange}
                  disabled={selectedProductId === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}