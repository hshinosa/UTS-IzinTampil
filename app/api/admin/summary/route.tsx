import { NextResponse } from 'next/server';

export async function GET() {
  const summaryData = {
    totalUsers: 150,
    activeTasks: 45,
  };
  return NextResponse.json(summaryData);
}