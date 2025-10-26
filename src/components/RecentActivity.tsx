import React, { useEffect, useState } from 'react';
import { MessageSquare, Phone, Video, Code, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentActivity } from '@/lib/activity';

const iconMap = {
  message: MessageSquare,
  call: Phone,
  video: Video,
  api: Code,
};

export function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getRecentActivity(10)
      .then(data => {
        if (mounted) {
          setActivities(data.activities || data);
          setLoading(false);
        }
      })
      .catch(e => {
        if (mounted) {
          setError('Failed to load activity');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-blue-600 py-6 text-center">Loading activity...</div>
        ) : error ? (
          <div className="text-red-500 py-6 text-center">{error}</div>
        ) : activities.length === 0 ? (
          <div className="text-gray-400 py-6 text-center">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = iconMap[activity.type] || MessageSquare;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className={`w-5 h-5 text-blue-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900">{activity.title}</p>
                    <p className="text-xs text-blue-600">{activity.description}</p>
                    <p className="text-xs text-blue-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
