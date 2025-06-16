
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsCards } from "@/components/MetricsCards";
import { UsageChart } from "@/components/UsageChart";
import { RecentActivity } from "@/components/RecentActivity";
import  QuickActions from "@/components/QuickActions";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <MetricsCards />
                <UsageChart />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
