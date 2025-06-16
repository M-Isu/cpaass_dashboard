
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Code, 
  BarChart3, 
  Settings, 
  Users, 
  CreditCard,
  Bell,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Messaging",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Voice Calls",
    url: "#",
    icon: Phone,
  },
  {
    title: "Video",
    url: "#",
    icon: Video,
  },
  {
    title: "APIs",
    url: "#",
    icon: Code,
  },
  {
    title: "Analytics",
    url: "#",
    icon: BarChart3,
  },
];

const accountItems = [
  {
    title: "Contacts",
    url: "#",
    icon: Users,
  },
  {
    title: "Billing",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-blue-100">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-blue-900">CPaaS Hub</h2>
            <p className="text-xs text-blue-600">Communications Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                    <a href={item.url} className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">John Doe</p>
            <p className="text-xs text-blue-600">Admin</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
