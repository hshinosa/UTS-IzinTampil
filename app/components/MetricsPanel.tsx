type MetricsData = {
  uptime: string;
  clusterStatus: string;
  activeAlerts: number;
};

interface MetricsPanelProps {
  data: MetricsData;
}

export function MetricsPanel({ data }: MetricsPanelProps) {
  return (
    <div>
      <p>Uptime: {data.uptime}</p>
      <p>Cluster Status: {data.clusterStatus}</p>
      <p>Active Alerts: {data.activeAlerts}</p>
    </div>
  );
}
