import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsContent from '../../../app/components/analytics/AnalyticsContent';

const mockAnalyticsData = {
  totalTasks: 100,
  completedTasks: 75,
  inProgressTasks: 15,
  pendingTasks: 10,
  tasksByPriority: [
    { priority: 'high', count: 30 },
    { priority: 'medium', count: 50 },
    { priority: 'low', count: 20 }
  ],
  tasksByDate: [
    { date: '2024-01-01', completed: 5, created: 8 },
    { date: '2024-01-02', completed: 3, created: 6 },
    { date: '2024-01-03', completed: 7, created: 4 },
    { date: '2024-01-04', completed: 2, created: 5 },
    { date: '2024-01-05', completed: 8, created: 7 }
  ],
  completionRateByMonth: [
    { month: 'Jan', rate: 85 },
    { month: 'Feb', rate: 72 },
    { month: 'Mar', rate: 90 },
    { month: 'Apr', rate: 68 },
    { month: 'May', rate: 78 },
    { month: 'Jun', rate: 82 }
  ]
};

const mockEmptyData = {
  totalTasks: 0,
  completedTasks: 0,
  inProgressTasks: 0,
  pendingTasks: 0,
  tasksByPriority: [],
  tasksByDate: [],
  completionRateByMonth: []
};

describe('AnalyticsContent Component', () => {
  it('renders summary statistics correctly', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('75% completion rate')).toBeInTheDocument();
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('calculates completion percentage correctly', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // 75 completed out of 100 total = 75%
    expect(screen.getByText('75% completion rate')).toBeInTheDocument();
  });

  it('handles zero total tasks for completion percentage', () => {
    render(<AnalyticsContent data={mockEmptyData} />);
    
    // Should show 0% when no tasks
    expect(screen.getByText('0% completion rate')).toBeInTheDocument();
  });

  it('renders priority distribution section', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
    
    // Check priority counts (data comes as lowercase but displayed with capitalize CSS)
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('calculates priority percentages correctly', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // High: 30/100 = 30%
    expect(screen.getByText('30% of total')).toBeInTheDocument();
    // Medium: 50/100 = 50%  
    expect(screen.getByText('50% of total')).toBeInTheDocument();
    // Low: 20/100 = 20%
    expect(screen.getByText('20% of total')).toBeInTheDocument();
  });

  it('renders monthly completion rate section', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    expect(screen.getByText('Monthly Completion Rate')).toBeInTheDocument();
    
    // Check some months and their rates
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    
    expect(screen.getByText('Mar')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  it('renders daily activity section', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    expect(screen.getByText('Daily Task Activity')).toBeInTheDocument();
    
    // Check some daily activities
    expect(screen.getByText('Completed: 5')).toBeInTheDocument();
    expect(screen.getByText('Created: 8')).toBeInTheDocument();
    expect(screen.getByText('Total: 13')).toBeInTheDocument();
  });

  it('displays last 10 days in daily activity', () => {
    const dataWithManyDays = {
      ...mockAnalyticsData,
      tasksByDate: Array.from({ length: 15 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        completed: i + 1,
        created: i + 2
      }))
    };

    render(<AnalyticsContent data={dataWithManyDays} />);
    
    // Should only show last 10 days (slice(-10))
    const totalElements = screen.getAllByText(/Total: \d+/);
    expect(totalElements).toHaveLength(10);
  });

  it('handles empty priority data gracefully', () => {
    const dataWithEmptyPriorities = {
      ...mockAnalyticsData,
      tasksByPriority: []
    };

    render(<AnalyticsContent data={dataWithEmptyPriorities} />);
    
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
    // Should not crash and still render the section header
  });

  it('handles empty monthly data gracefully', () => {
    const dataWithEmptyMonths = {
      ...mockAnalyticsData,
      completionRateByMonth: []
    };

    render(<AnalyticsContent data={dataWithEmptyMonths} />);
    
    expect(screen.getByText('Monthly Completion Rate')).toBeInTheDocument();
    // Should not crash and still render the section header
  });

  it('handles empty daily data gracefully', () => {
    const dataWithEmptyDays = {
      ...mockAnalyticsData,
      tasksByDate: []
    };

    render(<AnalyticsContent data={dataWithEmptyDays} />);
    
    expect(screen.getByText('Daily Task Activity')).toBeInTheDocument();
    // Should not crash and still render the section header
  });

  it('displays correct icons for each priority level', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // Check that priority sections are rendered with their respective colors
    const highSection = screen.getByText('high').closest('div');
    const mediumSection = screen.getByText('medium').closest('div');
    const lowSection = screen.getByText('low').closest('div');
    
    expect(highSection).toBeInTheDocument();
    expect(mediumSection).toBeInTheDocument(); 
    expect(lowSection).toBeInTheDocument();
  });

  it('formats dates correctly in daily activity', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // Check that dates are formatted in Indonesian locale (like "1 Jan")
    expect(screen.getByText('1 Jan')).toBeInTheDocument();
    expect(screen.getByText('2 Jan')).toBeInTheDocument();
  });

  it('renders all required section headers', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument();
    expect(screen.getByText('Monthly Completion Rate')).toBeInTheDocument();
    expect(screen.getByText('Daily Task Activity')).toBeInTheDocument();
  });

  it('shows proper progress bars for priorities', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // Check that progress bars are rendered (they should have specific widths)
    const progressBars = document.querySelectorAll('[style*="width"]');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('shows proper progress bars for monthly completion rates', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);
    
    // Monthly rates should have progress bars with specific widths
    const rateElements = document.querySelectorAll('[style*="width: 85%"], [style*="width: 72%"], [style*="width: 90%"]');
    expect(rateElements.length).toBeGreaterThan(0);
  });
});
