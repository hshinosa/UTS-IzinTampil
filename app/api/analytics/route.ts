import { NextRequest, NextResponse } from 'next/server';

// Mock database - simulating real tasks with dates
// In production, this would be from actual database
const mockTasks = [
  // High priority tasks
  { id: 1, title: 'Fix critical bug', priority: 'high', status: 'completed', createdAt: '2024-11-01', completedAt: '2024-11-02' },
  { id: 2, title: 'Security update', priority: 'high', status: 'completed', createdAt: '2024-11-02', completedAt: '2024-11-03' },
  { id: 3, title: 'Database optimization', priority: 'high', status: 'in-progress', createdAt: '2024-11-03', completedAt: null },
  { id: 4, title: 'API refactoring', priority: 'high', status: 'completed', createdAt: '2024-11-04', completedAt: '2024-11-06' },
  { id: 5, title: 'Performance tuning', priority: 'high', status: 'completed', createdAt: '2024-11-05', completedAt: '2024-11-07' },
  { id: 6, title: 'Deploy to production', priority: 'high', status: 'pending', createdAt: '2024-11-06', completedAt: null },
  { id: 7, title: 'Server migration', priority: 'high', status: 'completed', createdAt: '2024-10-28', completedAt: '2024-10-30' },
  { id: 8, title: 'Backup system', priority: 'high', status: 'completed', createdAt: '2024-10-25', completedAt: '2024-10-27' },
  { id: 9, title: 'Load testing', priority: 'high', status: 'in-progress', createdAt: '2024-11-07', completedAt: null },
  { id: 10, title: 'Code review', priority: 'high', status: 'completed', createdAt: '2024-10-20', completedAt: '2024-10-22' },
  
  // Medium priority tasks
  { id: 11, title: 'Update documentation', priority: 'medium', status: 'completed', createdAt: '2024-11-01', completedAt: '2024-11-04' },
  { id: 12, title: 'Write unit tests', priority: 'medium', status: 'completed', createdAt: '2024-11-02', completedAt: '2024-11-05' },
  { id: 13, title: 'Refactor components', priority: 'medium', status: 'in-progress', createdAt: '2024-11-03', completedAt: null },
  { id: 14, title: 'Update dependencies', priority: 'medium', status: 'completed', createdAt: '2024-11-04', completedAt: '2024-11-06' },
  { id: 15, title: 'Add error handling', priority: 'medium', status: 'completed', createdAt: '2024-11-05', completedAt: '2024-11-08' },
  { id: 16, title: 'Implement logging', priority: 'medium', status: 'pending', createdAt: '2024-11-06', completedAt: null },
  { id: 17, title: 'Setup monitoring', priority: 'medium', status: 'completed', createdAt: '2024-10-29', completedAt: '2024-11-01' },
  { id: 18, title: 'Configure CI/CD', priority: 'medium', status: 'completed', createdAt: '2024-10-26', completedAt: '2024-10-28' },
  { id: 19, title: 'Add analytics', priority: 'medium', status: 'in-progress', createdAt: '2024-11-07', completedAt: null },
  { id: 20, title: 'Improve UI/UX', priority: 'medium', status: 'completed', createdAt: '2024-10-22', completedAt: '2024-10-25' },
  
  // Low priority tasks
  { id: 21, title: 'Update README', priority: 'low', status: 'completed', createdAt: '2024-11-01', completedAt: '2024-11-02' },
  { id: 22, title: 'Clean up code', priority: 'low', status: 'completed', createdAt: '2024-11-02', completedAt: '2024-11-04' },
  { id: 23, title: 'Format files', priority: 'low', status: 'pending', createdAt: '2024-11-03', completedAt: null },
  { id: 24, title: 'Update comments', priority: 'low', status: 'completed', createdAt: '2024-11-04', completedAt: '2024-11-05' },
  { id: 25, title: 'Organize imports', priority: 'low', status: 'completed', createdAt: '2024-11-05', completedAt: '2024-11-06' },
  { id: 26, title: 'Add code examples', priority: 'low', status: 'pending', createdAt: '2024-11-06', completedAt: null },
  { id: 27, title: 'Update changelog', priority: 'low', status: 'completed', createdAt: '2024-10-30', completedAt: '2024-11-01' },
  { id: 28, title: 'Fix typos', priority: 'low', status: 'completed', createdAt: '2024-10-27', completedAt: '2024-10-28' },
  { id: 29, title: 'Archive old files', priority: 'low', status: 'in-progress', createdAt: '2024-11-07', completedAt: null },
  { id: 30, title: 'Cleanup logs', priority: 'low', status: 'completed', createdAt: '2024-10-23', completedAt: '2024-10-24' },
];

// Generate more historical data
for (let i = 31; i <= 156; i++) {
  const daysAgo = Math.floor(Math.random() * 365); // Random date in last year
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const priority = i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low';
  const statuses = ['completed', 'in-progress', 'pending'];
  const statusWeights = [0.7, 0.2, 0.1]; // 70% completed, 20% in-progress, 10% pending
  const rand = Math.random();
  const status = rand < statusWeights[0] ? 'completed' : rand < statusWeights[0] + statusWeights[1] ? 'in-progress' : 'pending';
  
  let completedAt = null;
  if (status === 'completed') {
    const completedDate = new Date(createdDate);
    completedDate.setDate(completedDate.getDate() + Math.floor(Math.random() * 5) + 1);
    completedAt = completedDate.toISOString().split('T')[0];
  }
  
  mockTasks.push({
    id: i,
    title: `Task ${i}`,
    priority,
    status,
    createdAt: createdDate.toISOString().split('T')[0],
    completedAt
  });
}

// Function to filter and aggregate data based on date range
function generateMockAnalyticsData(startDate?: string, endDate?: string) {
  const start = startDate ? new Date(startDate) : new Date('2020-01-01');
  const end = endDate ? new Date(endDate) : new Date();
  
  // Set time to start/end of day for accurate comparison
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  
  // Filter tasks that were created within the date range
  const filteredTasks = mockTasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= start && taskDate <= end;
  });
  
  // Calculate task statistics from filtered data
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = filteredTasks.filter(t => t.status === 'pending').length;

  // Generate priority data from filtered tasks
  const priorityCounts = filteredTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const tasksByPriority = [
    { priority: 'high', count: priorityCounts.high || 0 },
    { priority: 'medium', count: priorityCounts.medium || 0 },
    { priority: 'low', count: priorityCounts.low || 0 }
  ];

  // Generate date-based activity data
  const tasksByDate = [];
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const maxDays = Math.min(daysDiff, 30);
  const step = daysDiff > 30 ? Math.ceil(daysDiff / 30) : 1;
  
  for (let i = maxDays; i >= 0; i -= step) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    if (date < start) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    // Count tasks created on this date
    const created = filteredTasks.filter(t => t.createdAt === dateStr).length;
    
    // Count tasks completed on this date
    const completed = filteredTasks.filter(t => t.completedAt === dateStr).length;
    
    tasksByDate.push({
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      created,
      completed
    });
  }

  // Generate monthly completion rate
  const completionRateByMonth = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  // Group tasks by month
  const monthlyData = filteredTasks.reduce((acc, task) => {
    const taskDate = new Date(task.createdAt);
    const monthKey = `${taskDate.getFullYear()}-${taskDate.getMonth()}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { total: 0, completed: 0, month: taskDate.getMonth(), year: taskDate.getFullYear() };
    }
    
    acc[monthKey].total++;
    if (task.status === 'completed') {
      acc[monthKey].completed++;
    }
    
    return acc;
  }, {} as Record<string, { total: number; completed: number; month: number; year: number }>);
  
  // Convert to array and calculate rates
  Object.values(monthlyData).forEach(data => {
    const rate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
    completionRateByMonth.push({
      month: months[data.month],
      rate
    });
  });
  
  // If no data in range, show at least current month with 0%
  if (completionRateByMonth.length === 0) {
    completionRateByMonth.push({
      month: months[end.getMonth()],
      rate: 0
    });
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
