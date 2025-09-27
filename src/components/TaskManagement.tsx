import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Droplets, 
  Sprout, 
  AlertCircle,
  CheckCircle2,
  Plus
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Watering' | 'Fertilizing' | 'Monitoring' | 'Harvesting';
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Apply NPK Fertilizer',
    description: 'Apply NPK 19:19:19 fertilizer to tomato plants - 50g per plant',
    dueDate: 'Today',
    priority: 'High',
    category: 'Fertilizing',
    completed: false
  },
  {
    id: '2',
    title: 'Check Soil Moisture',
    description: 'Monitor soil moisture levels in field sections A & B',
    dueDate: 'Tomorrow',
    priority: 'Medium',
    category: 'Monitoring',
    completed: false
  },
  {
    id: '3',
    title: 'Water Maize Plants',
    description: 'Deep watering for maize - 20L per square meter',
    dueDate: 'Today',
    priority: 'High',
    category: 'Watering',
    completed: true
  },
  {
    id: '4',
    title: 'Pest Inspection',
    description: 'Check for aphids and caterpillars on tomato leaves',
    dueDate: 'In 2 days',
    priority: 'Medium',
    category: 'Monitoring',
    completed: false
  }
];

interface TaskManagementProps {
  isVisible: boolean;
}

const TaskManagement = ({ isVisible }: TaskManagementProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  if (!isVisible) return null;

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Watering': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'Fertilizing': return <Sprout className="w-4 h-4 text-green-500" />;
      case 'Monitoring': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Harvesting': return <CheckCircle2 className="w-4 h-4 text-orange-500" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateColor = (dueDate: string) => {
    if (dueDate === 'Today') return 'text-red-600 font-semibold';
    if (dueDate === 'Tomorrow') return 'text-orange-600 font-medium';
    return 'text-muted-foreground';
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2 justify-center">
          <Calendar className="w-6 h-6 text-primary" />
          Daily Tasks
        </h2>
        <p className="text-muted-foreground">Manage your farming activities</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Tasks */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Pending Tasks
              </span>
              <Badge variant="outline">{pendingTasks.length}</Badge>
            </CardTitle>
            <CardDescription>
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        {getCategoryIcon(task.category)}
                        {task.title}
                      </h4>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    
                    <p className={`text-sm ${getDueDateColor(task.dueDate)}`}>
                      Due: {task.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingTasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>All tasks completed!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Completed Tasks
              </span>
              <Badge variant="outline">{completedTasks.length}</Badge>
            </CardTitle>
            <CardDescription>
              Recently completed activities
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-green-50/50">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2 opacity-75">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2 line-through">
                        {getCategoryIcon(task.category)}
                        {task.title}
                      </h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Done
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {completedTasks.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2" />
                <p>No completed tasks yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Droplets className="w-6 h-6 text-blue-500" />
              <span className="text-sm">Water Plants</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Sprout className="w-6 h-6 text-green-500" />
              <span className="text-sm">Add Fertilizer</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              <span className="text-sm">Pest Check</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6 text-purple-500" />
              <span className="text-sm">Schedule Task</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManagement;