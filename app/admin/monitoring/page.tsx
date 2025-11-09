"use client";

import { useEffect, useState } from "react";
import MetricsPanel from "../../components/MetricsPanel"; // default import
import LogsPanel from "../../components/LogsPanel";
import { MetricsData } from "@/app/api/metrics/route";

export default function MonitoringPage() {
  const [data, setData] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/metrics");
        if (!res.ok) throw new Error("Failed to fetch metrics data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchMetrics();
  }, []);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Metrics in one row with individual boxes */}
      <MetricsPanel data={data} />

      {/* Logs in one big box, scrollable */}
      <LogsPanel logs={data.errorLogs} />
    </div>
  );
}
