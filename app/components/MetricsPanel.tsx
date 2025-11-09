export default function MetricsPanel({ data }: { data: any }) {
  return (
    <div className="mb-4 p-4 border rounded bg-white dark:bg-gray-800">
      <h2 className="font-semibold">Metrics</h2>
      <p>Uptime: {data.uptime}</p>
      <p>Cluster Status: {data.clusterStatus}</p>
      <p>Active Alerts: {data.activeAlerts}</p>
    </div>
  );
}
