
import { useEffect, useState } from "react";
import { MessageSquare, Phone, Video, Code, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/lib/api";

interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  color: string;
}

export function MetricsCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: "Messages Sent",
      value: "0",
      change: "0%",
      trend: "up",
      icon: MessageSquare,
      color: "blue",
    },
    {
      title: "Voice Minutes",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Phone,
      color: "green",
    },
    {
      title: "Video Sessions",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Video,
      color: "purple",
    },
    {
      title: "API Calls",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Code,
      color: "orange",
    },
  ]);

  useEffect(() => {
    let mounted = true;

    const loadMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getUserMetrics();
        
        if (!mounted) return;

        // Calculate total messages
        const totalMessages = (res.totals?.sms || 0) + (res.totals?.email || 0) + (res.totals?.whatsapp || 0);

        // Calculate percentage change from last month's total
        const lastMonth = res.series?.[0];
        const monthBefore = res.series?.[1];
        const monthlyChange = lastMonth && monthBefore 
          ? ((lastMonth.sms + lastMonth.email + lastMonth.whatsapp) - 
             (monthBefore.sms + monthBefore.email + monthBefore.whatsapp)) / 
             (monthBefore.sms + monthBefore.email + monthBefore.whatsapp) * 100
          : 0;

        const trend = monthlyChange >= 0 ? "up" : "down";
        const formattedChange = `${Math.abs(monthlyChange).toFixed(1)}%`;

        setMetrics(prev => 
          prev.map(metric => {
            if (metric.title === "Messages Sent") {
              return {
                ...metric,
                value: totalMessages.toLocaleString(),
                change: formattedChange,
                trend
              };
            }
            return metric;
          })
        );
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load metrics');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadMetrics();

    // Add event listener for metrics updates
    const handleMetricsUpdate = () => loadMetrics();
    window.addEventListener('metrics-update', handleMetricsUpdate);

    return () => { 
      mounted = false;
      window.removeEventListener('metrics-update', handleMetricsUpdate);
    };
  }, []);

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
