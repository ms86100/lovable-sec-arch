import { useState } from "react";
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
  GitBranch
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "Modern e-commerce solution with microservices architecture",
      progress: 85,
      status: "On Track",
      priority: "High",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      teamSize: 8,
      budget: "$120,000",
      spent: "$95,000",
      manager: "Sarah Johnson",
      tags: ["Web", "Microservices", "React"]
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      description: "Complete UI/UX overhaul for mobile application",
      progress: 60,
      status: "At Risk",
      priority: "Medium",
      startDate: "2024-02-01",
      endDate: "2024-04-15",
      teamSize: 5,
      budget: "$75,000",
      spent: "$52,000",
      manager: "Mike Chen",
      tags: ["Mobile", "UI/UX", "Design"]
    },
    {
      id: 3,
      name: "Data Migration Project",
      description: "Legacy system data migration to cloud infrastructure",
      progress: 95,
      status: "On Track",
      priority: "High",
      startDate: "2024-01-01",
      endDate: "2024-02-28",
      teamSize: 3,
      budget: "$45,000",
      spent: "$43,000",
      manager: "Alex Rivera",
      tags: ["Database", "Cloud", "Migration"]
    },
    {
      id: 4,
      name: "Security Audit & Compliance",
      description: "Comprehensive security assessment and GDPR compliance",
      progress: 40,
      status: "Behind",
      priority: "Critical",
      startDate: "2024-02-15",
      endDate: "2024-05-01",
      teamSize: 6,
      budget: "$90,000",
      spent: "$35,000",
      manager: "Emma Wilson",
      tags: ["Security", "Compliance", "Audit"]
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage and monitor all your projects</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
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
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="behind">Behind</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="border-border hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg text-foreground">{project.name}</CardTitle>
                      <Star className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <Badge variant={
                    project.status === "On Track" ? "default" : 
                    project.status === "At Risk" ? "secondary" : "destructive"
                  }>
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className={
                    project.priority === "Critical" ? "border-destructive text-destructive" :
                    project.priority === "High" ? "border-primary text-primary" : ""
                  }>
                    {project.priority}
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
                    <span className="text-foreground">{new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="w-3 h-3 mr-1" />
                      Team Size
                    </div>
                    <span className="text-foreground">{project.teamSize} members</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-muted-foreground">
                      <GitBranch className="w-3 h-3 mr-1" />
                      Manager
                    </div>
                    <span className="text-foreground">{project.manager}</span>
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="text-foreground">{project.spent} / {project.budget}</span>
                  </div>
                  <Progress 
                    value={(parseInt(project.spent.replace(/[$,]/g, '')) / parseInt(project.budget.replace(/[$,]/g, ''))) * 100} 
                    className="h-1"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
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