import { MetricsData } from "@/app/api/metrics/route";

interface MetricsPanelProps {
  data: MetricsData;
}

export default function MetricsPanel({ data }: MetricsPanelProps) {
  return (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">

      {/* Judul Utama */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Metrics Overview
      </h1>

      {/* Metrik Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
          <h2 className="text-xl font-semibold mb-2">Uptime</h2>
          <p>{data.uptime}</p>
        </div>
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
          <h2 className="text-xl font-semibold mb-2">Requests</h2>
          <p>{data.requests}</p>
        </div>
        <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 shadow">
          <h2 className="text-xl font-semibold mb-2">App Health</h2>
          <p>{data.appHealth}</p>
        </div>
    </div>
  </div>
  );
}
