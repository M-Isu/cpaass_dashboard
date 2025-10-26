
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiService } from "@/lib/api";

type SeriesPoint = {
  date: string;
  sms: number;
  email: number;
  whatsapp: number;
};

export function UsageChart() {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [totals, setTotals] = useState<{ sms?: number; email?: number; whatsapp?: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getUserMetrics();
        // expected shape: { totals: { sms, email, whatsapp }, series: [ { date, sms, email, whatsapp } ] }
        if (!mounted) return;
        setTotals(res.totals || {});
        setData(Array.isArray(res.series) ? res.series.map((p: any) => ({ date: p.date, sms: p.sms || 0, email: p.email || 0, whatsapp: p.whatsapp || 0 })) : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load metrics');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <div className="flex items-start justify-between w-full">
          <div>
            <CardTitle className="text-blue-900">Your Messages (7-day)</CardTitle>
            <p className="text-blue-600 text-sm">Messages sent per channel (last 7 days)</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Totals</div>
            <div className="text-lg font-semibold text-gray-800">
              SMS: {totals.sms ?? 0} • Email: {totals.email ?? 0} • WhatsApp: {totals.whatsapp ?? 0}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">Loading...</div>
        ) : error ? (
          <div className="h-80 flex items-center justify-center text-red-600">{error}</div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="date" stroke="#3b82f6" />
                <YAxis stroke="#3b82f6" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #dbeafe',
                    borderRadius: '8px'
                  }}
                />
                <Line type="monotone" dataKey="sms" stroke="#3b82f6" strokeWidth={3} name="SMS" />
                <Line type="monotone" dataKey="email" stroke="#10b981" strokeWidth={3} name="Email" />
                <Line type="monotone" dataKey="whatsapp" stroke="#8b5cf6" strokeWidth={3} name="WhatsApp" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-700">SMS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-blue-700">Email</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-blue-700">WhatsApp</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
