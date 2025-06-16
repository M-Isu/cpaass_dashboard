
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", messages: 4000, voice: 2400, video: 1200, api: 3200 },
  { name: "Feb", messages: 3000, voice: 1398, video: 1800, api: 2800 },
  { name: "Mar", messages: 2000, voice: 9800, video: 2400, api: 3900 },
  { name: "Apr", messages: 2780, voice: 3908, video: 1600, api: 4200 },
  { name: "May", messages: 1890, voice: 4800, video: 2200, api: 3800 },
  { name: "Jun", messages: 2390, voice: 3800, video: 1900, api: 4100 },
];

export function UsageChart() {
  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900">Usage Overview</CardTitle>
        <p className="text-blue-600 text-sm">Monthly usage across all services</p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis dataKey="name" stroke="#3b82f6" />
              <YAxis stroke="#3b82f6" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #dbeafe',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="voice" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="video" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="api" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-700">Messages</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-blue-700">Voice</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-blue-700">Video</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-blue-700">API</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
