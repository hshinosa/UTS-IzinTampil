import { NextResponse } from 'next/server';

export async function GET() {
  const overviewData = {
    totalTasks: 120,
    completedTasks: 80,
    inProgressTasks: 30,
    pendingTasks: 10,
  };
  return NextResponse.json(overviewData);
}