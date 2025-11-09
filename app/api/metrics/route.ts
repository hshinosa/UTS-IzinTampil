import { NextResponse } from "next/server";

export type LogEntry = { time: string; message: string };
export type MetricsData = {
  uptime: string;
  clusterStatus: string;
  activeAlerts: number;
  errorLogs: LogEntry[];
};

export async function GET() {
  const data: MetricsData = {
    uptime: "99.9%",
    clusterStatus: "Healthy",
    activeAlerts: 2,
    errorLogs: [
      { time: "2025-11-09T10:00:00Z", message: "Error connecting to DB" },
      { time: "2025-11-09T11:00:00Z", message: "Timeout on API request" },
    ],
  };

  return NextResponse.json(data);
}
