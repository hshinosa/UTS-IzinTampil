import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type LogEntry = { time: string; message: string };

export type MetricsData = {
    appHealth: string;
    uptime: number;
    requests: number;
    errorLogs: LogEntry[];
};

export async function GET() {
    // Ambil 10 error log terbaru
    const errorLogs = await prisma.errorLog.findMany({
        orderBy: { time: "desc" },
        take: 10,
    });

    const data: MetricsData = {
        appHealth: "ok",
        uptime: process.uptime() * 1000,
        requests: 123, // bisa diganti logika real jika tersedia
        errorLogs: errorLogs.map((e: { time: Date; message: string }): LogEntry => ({
            time: e.time.toISOString(),
            message: e.message,
        })),

    };

    return NextResponse.json(data);
}
