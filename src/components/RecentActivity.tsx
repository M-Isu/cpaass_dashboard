
import { MessageSquare, Phone, Video, Code, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    type: "message",
    title: "SMS Campaign sent",
    description: "Marketing campaign to 15,000 contacts",
    time: "2 minutes ago",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    type: "call",
    title: "Voice call completed",
    description: "Customer support call - 45 minutes",
    time: "15 minutes ago",
    icon: Phone,
    color: "text-green-600",
  },
  {
    type: "video",
    title: "Video conference ended",
    description: "Team meeting with 8 participants",
    time: "1 hour ago",
    icon: Video,
    color: "text-purple-600",
  },
  {
    type: "api",
    title: "API key generated",
    description: "New API key for mobile app",
    time: "2 hours ago",
    icon: Code,
    color: "text-orange-600",
  },
  {
    type: "message",
    title: "Webhook configured",
    description: "Message delivery webhook setup",
    time: "3 hours ago",
    icon: MessageSquare,
    color: "text-blue-600",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900">{activity.title}</p>
                <p className="text-xs text-blue-600">{activity.description}</p>
                <p className="text-xs text-blue-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
