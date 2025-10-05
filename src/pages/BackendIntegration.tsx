import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AuthIntegration } from "@/components/AuthIntegration";
import { RoleManagement } from "@/components/RoleManagement";
import { MessagingIntegration } from "@/components/MessagingIntegration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Chrome, 
  Facebook, 
  MessageCircle, 
  Users,
  CheckCircle,
  AlertCircle,
  Server,
  Database
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BackendIntegration = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-white">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Backend Integration</h1>
                  <p className="text-gray-600">Connect with Spring Boot backend services</p>
                </div>
              </div>

              {/* Backend Status */}
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Backend server running on <strong>http://localhost:8555</strong>
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="auth" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="auth" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Authentication
                  </TabsTrigger>
                  <TabsTrigger value="messaging" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Messaging
                  </TabsTrigger>
                  <TabsTrigger value="roles" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Role Management
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="auth" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <AuthIntegration />
                    </div>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Integration Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Google OAuth</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ready</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Facebook OAuth</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ready</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">WhatsApp API</span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Ready</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            API Endpoints
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                            GET /api/auth/google/signin
                          </div>
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                            GET /api/auth/facebook/signin
                          </div>
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                            GET /api/auth/whatsapp/sendMessage
                          </div>
                          <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                            POST /api/auth/roles
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="messaging" className="space-y-6">
                  <MessagingIntegration />
                </TabsContent>

                <TabsContent value="roles" className="space-y-6">
                  <RoleManagement />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BackendIntegration;
