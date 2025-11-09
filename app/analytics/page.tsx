'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/app/components/Navbar';
import { DateRangeFilter, AnalyticsContent, AnalyticsSkeleton } from '@/app/components/analytics';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  tasksByPriority: Array<{ priority: string; count: number }>;
  tasksByDate: Array<{ date: string; completed: number; created: number }>;
  completionRateByMonth: Array<{ month: string; rate: number }>;
}

interface DateRange {
  startDate: string;
  endDate: string;
  preset?: string;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    return {
      startDate: '2020-01-01',
      endDate: new Date().toISOString().split('T')[0],
      preset: 'all'
    };
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        });
        const response = await fetch(`/api/analytics?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Analytics</h3>
            <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analisis mendalam terhadap performa dan tren tugas-tugas Anda dengan visualisasi data yang komprehensif
          </p>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter 
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          loading={loading}
        />

        {/* Analytics Content */}
        {analyticsData && <AnalyticsContent data={analyticsData} />}
      </div>
    </div>
  );
}
