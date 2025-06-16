
import { MessageSquare, Phone, Video, Code, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Messages Sent",
    value: "127,432",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    color: "blue",
  },
  {
    title: "Voice Minutes",
    value: "8,940",
    change: "+8.3%",
    trend: "up",
    icon: Phone,
    color: "green",
  },
  {
    title: "Video Sessions",
    value: "2,145",
    change: "-3.2%",
    trend: "down",
    icon: Video,
    color: "purple",
  },
  {
    title: "API Calls",
    value: "45,821",
    change: "+15.7%",
    trend: "up",
    icon: Code,
    color: "orange",
  },
];

export function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-blue-100 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metric.value}</div>
            <div className="flex items-center space-x-1 text-xs">
              {metric.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                {metric.change}
              </span>
              <span className="text-blue-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
