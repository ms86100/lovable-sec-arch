import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronUp, Pin, Globe, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CompactCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  isGlobal?: boolean
  isPinned?: boolean
  onPin?: () => void
  children?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

export function CompactCard({
  title,
  value,
  description,
  icon,
  isGlobal = false,
  isPinned = false,
  onPin,
  children,
  variant = 'default',
  className = ''
}: CompactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20'
      case 'destructive':
        return 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
      default:
        return ''
    }
  }

  const globalStyles = isGlobal 
    ? 'bg-muted/30 border-muted-foreground/20 opacity-75' 
    : ''

  return (
    <TooltipProvider>
      <Card className={`transition-all duration-200 hover:shadow-md ${getVariantStyles()} ${globalStyles} ${className}`}>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CardHeader className="pb-2 space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {icon}
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium">{title}</CardTitle>
                  {isGlobal && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                          <Globe className="w-2 h-2 mr-1" />
                          Global
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This data is not filtered and shows global statistics</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isPinned && (
                    <Pin className="w-3 h-3 text-primary fill-primary" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {onPin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onPin}
                  >
                    <Pin className={`w-3 h-3 ${isPinned ? 'text-primary fill-primary' : ''}`} />
                  </Button>
                )}
                {children && (
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Info className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description || `${isGlobal ? 'Global' : 'Filtered'} ${title.toLowerCase()}`}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">{value}</div>
            {children && (
              <CollapsibleContent className="mt-4">
                {children}
              </CollapsibleContent>
            )}
          </CardContent>
        </Collapsible>
      </Card>
    </TooltipProvider>
  )
}