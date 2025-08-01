import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Dashboard</h1>
            <p className="text-muted-foreground">Monitor your projects and team performance</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Target className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Schedule</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">85%</div>
              <p className="text-xs text-muted-foreground">+5% improvement</p>
            </CardContent>
          </Card>

          <Card className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
              <p className="text-xs text-muted-foreground">-2 resolved today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Projects</CardTitle>
                <CardDescription>Your active project portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "E-Commerce Platform", progress: 85, status: "On Track", priority: "High", team: 8 },
                  { name: "Mobile App Redesign", progress: 60, status: "At Risk", priority: "Medium", team: 5 },
                  { name: "Data Migration", progress: 95, status: "On Track", priority: "High", team: 3 },
                  { name: "Security Audit", progress: 40, status: "Behind", priority: "Critical", team: 6 }
                ].map((project, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{project.name}</h4>
                        <Badge variant={
                          project.status === "On Track" ? "default" : 
                          project.status === "At Risk" ? "secondary" : "destructive"
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-3 h-3 mr-1" />
                          {project.team} members
                        </div>
                        <Badge variant="outline" className={
                          project.priority === "Critical" ? "border-destructive text-destructive" :
                          project.priority === "High" ? "border-primary text-primary" : ""
                        }>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Priority Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-l-4 border-l-destructive bg-destructive/5 rounded">
                  <p className="text-sm font-medium text-foreground">Security Review Due</p>
                  <p className="text-xs text-muted-foreground">Mobile App project needs security audit</p>
                </div>
                <div className="p-3 border-l-4 border-l-primary bg-primary/5 rounded">
                  <p className="text-sm font-medium text-foreground">Milestone Approaching</p>
                  <p className="text-xs text-muted-foreground">E-Commerce release in 3 days</p>
                </div>
                <div className="p-3 border-l-4 border-l-primary bg-primary/5 rounded">
                  <p className="text-sm font-medium text-foreground">Team Capacity</p>
                  <p className="text-xs text-muted-foreground">Backend team at 95% utilization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;