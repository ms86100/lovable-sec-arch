import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectForm } from '@/components/forms/ProjectForm'

const ProjectNew = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-tour="projectnew-title">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up a new project with all the necessary details and configuration.
          </p>
        </div>

        <div data-tour="projectnew-form">
          <ProjectForm
            onSuccess={() => navigate('/projects')}
            onCancel={() => navigate('/projects')}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectNew