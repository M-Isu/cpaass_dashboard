
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-blue-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-blue-600 hover:text-blue-700" />
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
            <p className="text-blue-600">Welcome back! Here's your CPaaS overview</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 w-64 border-blue-200 focus:border-blue-400"
            />
          </div>
          <Button variant="outline" size="icon" className="border-blue-200 hover:bg-blue-50">
            <Bell className="w-4 h-4 text-blue-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}
