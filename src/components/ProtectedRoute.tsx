import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'manager' | 'viewer'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth')
    }
  }, [user, loading, navigate])

  // Show loading skeleton while checking auth
  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return null
  }

  // Check role requirements
  if (requiredRole && userRole?.role !== requiredRole) {
    // Allow admin to access everything
    if (userRole?.role !== 'admin') {
      // Check role hierarchy: admin > manager > viewer
      const roleHierarchy = { admin: 3, manager: 2, viewer: 1 }
      const userRoleLevel = roleHierarchy[userRole?.role || 'viewer']
      const requiredRoleLevel = roleHierarchy[requiredRole]
      
      if (userRoleLevel < requiredRoleLevel) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
              <p className="text-muted-foreground">
                You need {requiredRole} privileges to access this page.
                Your current role: {userRole?.role || 'none'}
              </p>
            </div>
          </div>
        )
      }
    }
  }

  return <>{children}</>
}