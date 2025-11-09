"use client";

import { useEffect, useState } from "react";
import MetricsPanel from "../../components/MetricsPanel";
import LogsPanel from "../../components/LogsPanel";

export default function MonitoringPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Monitoring Dashboard</h1>
      <MetricsPanel data={data} />
      <LogsPanel logs={data.errorLogs} />
    </div>
  );
}
