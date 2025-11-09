import { NextRequest, NextResponse } from 'next/server';

// Mock data - In a real application, this would come from a database
function generateMockAnalyticsData() {
  const totalTasks = 156;
  const completedTasks = 98;
  const inProgressTasks = 34;
  const pendingTasks = 24;

  // Generate priority data
  const tasksByPriority = [
    { priority: 'high', count: 42 },
    { priority: 'medium', count: 68 },
    { priority: 'low', count: 46 }
  ];

  // Generate date data for last 7 days
  const tasksByDate = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    tasksByDate.push({
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      created: Math.floor(Math.random() * 10) + 5,
      completed: Math.floor(Math.random() * 8) + 3
    });
  }

  // Generate monthly completion rate
  const completionRateByMonth = [
    { month: 'Jan', rate: 78 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 85 },
    { month: 'Apr', rate: 91 },
    { month: 'Mei', rate: 88 },
    { month: 'Jun', rate: 93 }
  ];

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    tasksByPriority,
    tasksByDate,
    completionRateByMonth
  };
}

export async function GET(request: NextRequest) {
  try {
    // Add cache headers for optimization
    const headers = new Headers({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Content-Type': 'application/json'
    });

    const analyticsData = generateMockAnalyticsData();

    return new NextResponse(JSON.stringify(analyticsData), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch analytics data' }),
      {
        status: 500,
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    );
  }
}

// Support for POST requests to refresh data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real application, this would trigger a cache invalidation
    // or data refresh from the database
    
    const analyticsData = generateMockAnalyticsData();
    
    return new NextResponse(JSON.stringify({
      ...analyticsData,
      refreshed: true,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: new Headers({ 'Content-Type': 'application/json' })
    });
  } catch (error) {
    console.error('Analytics Refresh Error:', error);
    
    return new NextResponse(
      JSON.stringify({ error: 'Failed to refresh analytics data' }),
      {
        status: 500,
        headers: new Headers({ 'Content-Type': 'application/json' })
      }
    );
  }
}
