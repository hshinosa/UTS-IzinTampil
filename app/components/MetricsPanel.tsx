import { MetricsData } from "@/app/api/metrics/route";

interface MetricsPanelProps {
  data: MetricsData;
}

export default function MetricsPanel({ data }: MetricsPanelProps) {
  return (
    <div className="mb-6 p-4 border rounded bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2">Metrics</h2>
      <p>Uptime: {data.uptime}</p>
      <p>Cluster Status: {data.clusterStatus}</p>
      <p>Active Alerts: {data.activeAlerts}</p>
    </div>
  );
}
