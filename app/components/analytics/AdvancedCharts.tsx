'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  tasksByPriority: Array<{ priority: string; count: number }>;
  tasksByDate: Array<{ date: string; completed: number; created: number }>;
  completionRateByMonth: Array<{ month: string; rate: number }>;
}

interface AdvancedChartsProps {
  data: AnalyticsData;
}

// Color palettes for different chart types
const PRIORITY_COLORS = {
  high: '#ef4444', // red-500
  medium: '#f59e0b', // amber-500
  low: '#10b981' // emerald-500
};

const CHART_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ef4444', // red-500
  '#06b6d4'  // cyan-500
];

export default function AdvancedCharts({ data }: AdvancedChartsProps) {
  // Transform data for different chart types
  const getTaskStatusData = () => [
    { name: 'Completed', value: data.completedTasks, color: '#10b981' },
    { name: 'In Progress', value: data.inProgressTasks, color: '#f59e0b' },
    { name: 'Pending', value: data.pendingTasks, color: '#ef4444' }
  ];

  const getPriorityData = () => 
    data.tasksByPriority?.map(item => ({
      name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
      value: item.count,
      color: PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS] || '#6b7280'
    })) || [];

  const getTrendData = () => 
    data.tasksByDate?.slice(-30).map(item => ({
      date: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      completed: item.completed,
      created: item.created,
      total: item.completed + item.created,
      efficiency: item.created > 0 ? Math.round((item.completed / item.created) * 100) : 0
    })) || [];

  const getMonthlyData = () => 
    data.completionRateByMonth?.map(item => ({
      month: item.month,
      rate: item.rate,
      target: 80 // Target completion rate
    })) || [];

  const getProductivityData = () => {
    const trendData = getTrendData();
    return trendData.map((item, index) => ({
      day: item.date,
      productivity: item.efficiency,
      volume: item.total,
      smoothed: trendData
        .slice(Math.max(0, index - 2), index + 3)
        .reduce((sum, d) => sum + d.efficiency, 0) / Math.min(5, index + 3)
    }));
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
              {entry.name.includes('Rate') || entry.name.includes('Efficiency') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            Count: {data.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label for pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Hide labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const taskStatusData = getTaskStatusData();
  const priorityData = getPriorityData();
  const trendData = getTrendData();
  const monthlyData = getMonthlyData();
  const productivityData = getProductivityData();

  return (
    <div className="space-y-8">
      {/* Task Status Overview - Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Task Status Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskStatusData.map(item => ({ ...item, total: data.totalTasks }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution - Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Priority Distribution
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Completion Trend - Area Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Daily Task Activity Trend (Last 30 Days)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10b981"
                fill="url(#completedGradient)"
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="created"
                stackId="1"
                stroke="#3b82f6"
                fill="url(#createdGradient)"
                name="Created"
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Completion Rate vs Target - Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Monthly Performance vs Target
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
                name="Completion Rate"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target (80%)"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Productivity Analysis - Combined Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Productivity Analysis
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 11 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="right"
                dataKey="volume" 
                fill="#e5e7eb" 
                opacity={0.6}
                name="Task Volume"
                radius={[2, 2, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="productivity"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                name="Daily Efficiency"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="smoothed"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={false}
                strokeDasharray="3 3"
                name="Trend (5-day avg)"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Average Daily Tasks</h4>
          <p className="text-3xl font-bold">
            {trendData.length > 0 ? Math.round(trendData.reduce((sum, item) => sum + item.total, 0) / trendData.length) : 0}
          </p>
          <p className="text-blue-100 text-sm mt-1">Tasks per day</p>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Efficiency Rate</h4>
          <p className="text-3xl font-bold">
            {productivityData.length > 0 ? Math.round(productivityData.reduce((sum, item) => sum + item.productivity, 0) / productivityData.length) : 0}%
          </p>
          <p className="text-emerald-100 text-sm mt-1">Completion efficiency</p>
        </div>
        
        <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-lg p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">Peak Performance</h4>
          <p className="text-3xl font-bold">
            {monthlyData.length > 0 ? Math.max(...monthlyData.map(m => m.rate)) : 0}%
          </p>
          <p className="text-violet-100 text-sm mt-1">Best monthly rate</p>
        </div>
      </div>
    </div>
  );
}
