import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Star,
  GitBranch,
  Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  priority: string;
  progress: number | null;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  products: {
    name: string;
    owner_id: string;
  } | null;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const productFilter = searchParams.get('product');

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      console.log('No user found, not fetching projects');
      setLoading(false);
    }
  }, [user, productFilter]);

  const fetchProjects = async () => {
    try {
      console.log('Starting to fetch projects...');
      console.log('Current user:', user);
      console.log('Auth state:', await supabase.auth.getUser());
      
      // Try simple query first
      const { data: simpleData, error: simpleError } = await supabase
        .from('projects')
        .select('*')
        .limit(5);
      
      console.log('Simple query result:', { simpleData, simpleError });
      
      if (simpleError) {
        toast({
          title: "Error",
          description: `Database access error: ${simpleError.message}`,
          variant: "destructive",
        });
        return;
      }
      
      let query = supabase
        .from('projects')
        .select(`
          *,
          products (
            name,
            owner_id
          )
        `)
        .eq('is_active', true) // Only show active projects
        
      // Apply product filter if specified
      if (productFilter) {
        query = query.eq('product_id', productFilter)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      console.log('Query result:', { data, error });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: `Failed to load projects: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Projects data:', data);
      setProjects(data || []);
    } catch (error) {
      console.error('Catch block error:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase().replace(" ", "_") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'planning': return 'secondary';
      case 'on_hold': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">
              {productFilter ? 'Projects filtered by selected product' : 'Manage and monitor all your projects'}
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/projects/new')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="border-border hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                      <Star className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu action
                    }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge variant={getPriorityColor(project.priority)}>
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Due Date
                    </div>
                    <span className="text-foreground">
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <GitBranch className="w-3 h-3 mr-1" />
                      Product
                    </div>
                    <span className="text-foreground">{project.products?.name || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      Project ID
                    </div>
                    <span className="text-foreground text-xs">{project.id.slice(0, 8)}...</span>
                  </div>
                </div>

                {/* Budget */}
                {project.budget && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="text-foreground">${project.budget.toLocaleString()}</span>
                    </div>
                    <Progress value={50} className="h-1" />
                  </div>
                )}

                {/* Created Date */}
                <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm ? "Try adjusting your search criteria" : "Create your first project to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Projects;