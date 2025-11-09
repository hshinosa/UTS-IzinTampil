import { NextRequest, NextResponse } from 'next/server';

// Mock data - In a real application, this would come from a database
function generateMockAnalyticsData(startDate?: string, endDate?: string) {
  // Parse date range if provided
  const start = startDate ? new Date(startDate) : new Date('2024-01-01');
  const end = endDate ? new Date(endDate) : new Date();
  
  // Calculate days between dates for dynamic data generation
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const multiplier = Math.max(1, Math.floor(daysDiff / 30)); // Scale based on date range
  
  const totalTasks = Math.floor(156 * multiplier);
  const completedTasks = Math.floor(98 * multiplier);
  const inProgressTasks = Math.floor(34 * multiplier);
  const pendingTasks = Math.floor(24 * multiplier);

  // Generate priority data (scaled by multiplier)
  const tasksByPriority = [
    { priority: 'high', count: Math.floor(42 * multiplier) },
    { priority: 'medium', count: Math.floor(68 * multiplier) },
    { priority: 'low', count: Math.floor(46 * multiplier) }
  ];

  // Generate date data based on the provided date range
  const tasksByDate = [];
  const maxDays = Math.min(daysDiff, 30); // Limit to 30 days max for display
  const step = daysDiff > 30 ? Math.ceil(daysDiff / 30) : 1; // Show fewer data points for longer ranges
  
  for (let i = maxDays; i >= 0; i -= step) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    
    // Skip if date is before start date
    if (date < start) continue;
    
    const baseCreated = Math.floor(Math.random() * 10) + 5;
    const baseCompleted = Math.floor(Math.random() * 8) + 3;
    
    tasksByDate.push({
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      created: Math.floor(baseCreated * Math.max(0.5, multiplier * 0.8)),
      completed: Math.floor(baseCompleted * Math.max(0.5, multiplier * 0.8))
    });
  }

  // Generate monthly completion rate based on date range
  const completionRateByMonth = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const startMonth = start.getMonth();
  const endMonth = end.getMonth();
  const yearDiff = end.getFullYear() - start.getFullYear();
  
  if (yearDiff === 0) {
    // Same year - show months in range
    for (let i = startMonth; i <= endMonth; i++) {
      completionRateByMonth.push({
        month: months[i],
        rate: Math.floor(Math.random() * 25) + 70 // 70-95% range
      });
    }
  } else {
    // Different years - show last 6 months from end date
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(end);
      monthDate.setMonth(monthDate.getMonth() - i);
      completionRateByMonth.push({
        month: months[monthDate.getMonth()],
        rate: Math.floor(Math.random() * 25) + 70
      });
    }
  }

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
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Add cache headers for optimization
    const headers = new Headers({
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'Content-Type': 'application/json'
    });

    const analyticsData = generateMockAnalyticsData(startDate || undefined, endDate || undefined);

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
