import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    uptime: "99.9%",
    clusterStatus: "Healthy",
    activeAlerts: 0,
    errorLogs: [
      { time: "2025-11-09T08:00:00Z", message: "Dummy log 1" },
      { time: "2025-11-09T09:00:00Z", message: "Dummy log 2" }
    ]
  });
}
