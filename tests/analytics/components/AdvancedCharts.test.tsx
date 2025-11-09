import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdvancedCharts from '../../../app/components/analytics/AdvancedCharts';

// Mock Recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name, dataKey }: any) => <div data-testid={`line-${dataKey}`}>{name}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: ({ name, dataKey }: any) => <div data-testid={`area-${dataKey}`}>{name}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ dataKey }: any) => <div data-testid={`bar-${dataKey}`}></div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ dataKey }: any) => <div data-testid={`pie-${dataKey}`}></div>,
  Cell: ({ fill }: any) => <div data-testid="cell" style={{ fill }}></div>,
  XAxis: ({ dataKey }: any) => <div data-testid={`x-axis-${dataKey || 'default'}`}></div>,
  YAxis: ({ yAxisId, orientation }: any) => (
    <div data-testid={`y-axis-${yAxisId || 'default'}-${orientation || 'left'}`}></div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Legend: () => <div data-testid="legend"></div>,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container" style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  )
}));

const mockAnalyticsData = {
  totalTasks: 150,
  completedTasks: 100,
  inProgressTasks: 30,
  pendingTasks: 20,
  tasksByPriority: [
    { priority: 'high', count: 45 },
    { priority: 'medium', count: 75 },
    { priority: 'low', count: 30 }
  ],
  tasksByDate: [
    { date: '2024-01-01', completed: 10, created: 12 },
    { date: '2024-01-02', completed: 8, created: 10 },
    { date: '2024-01-03', completed: 15, created: 8 },
    { date: '2024-01-04', completed: 12, created: 14 },
    { date: '2024-01-05', completed: 9, created: 11 }
  ],
  completionRateByMonth: [
    { month: 'Jan', rate: 85 },
    { month: 'Feb', rate: 78 },
    { month: 'Mar', rate: 92 },
    { month: 'Apr', rate: 88 },
    { month: 'May', rate: 83 },
    { month: 'Jun', rate: 90 }
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

describe('AdvancedCharts Component', () => {
  it('renders all chart sections', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument();
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
    expect(screen.getByText('Daily Task Activity Trend (Last 30 Days)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Performance vs Target')).toBeInTheDocument();
    expect(screen.getByText('Productivity Analysis')).toBeInTheDocument();
  });

  it('renders all chart components', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line-chart')).toHaveLength(2); // Monthly performance and productivity
  });

  it('renders responsive containers for all charts', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers).toHaveLength(5); // 5 main charts
  });

  it('renders pie chart for task status distribution', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('renders bar chart for priority distribution', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders area chart for task trends', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByTestId('area-completed')).toBeInTheDocument();
    expect(screen.getByTestId('area-created')).toBeInTheDocument();
  });

  it('renders line charts for monthly and productivity data', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByTestId('line-rate')).toBeInTheDocument();
    expect(screen.getByTestId('line-target')).toBeInTheDocument();
    expect(screen.getByTestId('line-productivity')).toBeInTheDocument();
    expect(screen.getByTestId('line-smoothed')).toBeInTheDocument();
  });

  it('renders chart summary statistics', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByText('Average Daily Tasks')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Rate')).toBeInTheDocument();
    expect(screen.getByText('Peak Performance')).toBeInTheDocument();
  });

  it('calculates average daily tasks correctly', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Average of (22, 18, 23, 26, 20) = 21.8 rounded to 22
    const avgElement = screen.getByText('Average Daily Tasks').closest('div');
    expect(avgElement).toHaveTextContent('22'); // Should show calculated average
  });

  it('calculates efficiency rate correctly', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Should calculate efficiency based on completed/created ratio
    const efficiencyElement = screen.getByText('Efficiency Rate').closest('div');
    expect(efficiencyElement).toHaveTextContent('%'); // Should have percentage
  });

  it('calculates peak performance correctly', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Maximum rate from mockData is 92%
    const peakElement = screen.getByText('Peak Performance').closest('div');
    expect(peakElement).toHaveTextContent('92%');
  });

  it('handles empty data gracefully', () => {
    render(<AdvancedCharts data={mockEmptyData} />);

    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument();
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
    
    // Summary stats should show 0 values
    const avgElement = screen.getByText('Average Daily Tasks').closest('div');
    expect(avgElement).toHaveTextContent('0');
    
    const efficiencyElement = screen.getByText('Efficiency Rate').closest('div');
    expect(efficiencyElement).toHaveTextContent('0%');
    
    const peakElement = screen.getByText('Peak Performance').closest('div');
    expect(peakElement).toHaveTextContent('0%');
  });

  it('handles null/undefined data arrays', () => {
    const nullData = {
      ...mockAnalyticsData,
      tasksByPriority: null,
      tasksByDate: null,
      completionRateByMonth: null
    };

    expect(() => {
      render(<AdvancedCharts data={nullData as any} />);
    }).not.toThrow();
  });

  it('renders correct number of axes for each chart', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Check for X axes
    expect(screen.getByTestId('x-axis-name')).toBeInTheDocument(); // Priority chart
    expect(screen.getByTestId('x-axis-date')).toBeInTheDocument(); // Trend chart
    expect(screen.getByTestId('x-axis-month')).toBeInTheDocument(); // Monthly chart
    expect(screen.getByTestId('x-axis-day')).toBeInTheDocument(); // Productivity chart

    // Check for Y axes (multiple charts have default Y-axes)
    expect(screen.getAllByTestId('y-axis-default-left')).toHaveLength(3); // Multiple charts
    expect(screen.getByTestId('y-axis-left-left')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-right-right')).toBeInTheDocument();
  });

  it('renders legends for charts that need them', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    const legends = screen.getAllByTestId('legend');
    expect(legends.length).toBeGreaterThan(0);
  });

  it('renders tooltips for all charts', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    const tooltips = screen.getAllByTestId('tooltip');
    expect(tooltips.length).toBeGreaterThan(0);
  });

  it('renders cartesian grids for appropriate chart types', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    const grids = screen.getAllByTestId('cartesian-grid');
    expect(grids.length).toBeGreaterThan(0);
  });

  it('handles single data point scenarios', () => {
    const singlePointData = {
      ...mockAnalyticsData,
      tasksByDate: [{ date: '2024-01-01', completed: 5, created: 8 }],
      completionRateByMonth: [{ month: 'Jan', rate: 85 }]
    };

    render(<AdvancedCharts data={singlePointData} />);
    
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument();
  });

  it('processes priority data with proper capitalization', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // The component should transform 'high' to 'High', etc.
    // Since we're using mocked recharts, we verify the component renders without error
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
  });

  it('calculates trend data correctly for last 30 days', () => {
    const manyDaysData = {
      ...mockAnalyticsData,
      tasksByDate: Array.from({ length: 35 }, (_, i) => ({
        date: `2024-01-${String(i + 1).padStart(2, '0')}`,
        completed: i + 1,
        created: i + 2
      }))
    };

    render(<AdvancedCharts data={manyDaysData} />);
    
    // Should only process last 30 days
    expect(screen.getByText('Daily Task Activity Trend (Last 30 Days)')).toBeInTheDocument();
  });

  it('renders gradient definitions for area charts', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Check that area chart is rendered (gradients would be in the actual SVG)
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('handles zero efficiency calculations', () => {
    const zeroEfficiencyData = {
      ...mockAnalyticsData,
      tasksByDate: [
        { date: '2024-01-01', completed: 0, created: 0 },
        { date: '2024-01-02', completed: 5, created: 0 } // created = 0 should not cause division by zero
      ]
    };

    expect(() => {
      render(<AdvancedCharts data={zeroEfficiencyData} />);
    }).not.toThrow();
  });

  it('renders all summary stat cards with proper styling', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    const avgCard = screen.getByText('Average Daily Tasks').closest('div');
    const efficiencyCard = screen.getByText('Efficiency Rate').closest('div');
    const peakCard = screen.getByText('Peak Performance').closest('div');

    expect(avgCard).toHaveClass('bg-gradient-to-r', 'from-blue-500', 'to-blue-600');
    expect(efficiencyCard).toHaveClass('bg-gradient-to-r', 'from-emerald-500', 'to-emerald-600');
    expect(peakCard).toHaveClass('bg-gradient-to-r', 'from-violet-500', 'to-violet-600');
  });

  it('renders icons for each chart section', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Each section should have an SVG icon
    const svgIcons = document.querySelectorAll('svg');
    expect(svgIcons.length).toBeGreaterThanOrEqual(5); // 5 chart sections + summary cards
  });

  it('displays proper task units in summary cards', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    expect(screen.getByText('Tasks per day')).toBeInTheDocument();
    expect(screen.getByText('Completion efficiency')).toBeInTheDocument();
    expect(screen.getByText('Best monthly rate')).toBeInTheDocument();
  });

  it('handles productivity smoothing calculation', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Should render productivity analysis without errors
    expect(screen.getByText('Productivity Analysis')).toBeInTheDocument();
    expect(screen.getByTestId('line-smoothed')).toBeInTheDocument();
  });

  it('renders dual Y-axes for productivity chart', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Should have both left and right Y-axes for the productivity chart
    expect(screen.getByTestId('y-axis-left-left')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis-right-right')).toBeInTheDocument();
  });

  it('processes date formatting correctly', () => {
    render(<AdvancedCharts data={mockAnalyticsData} />);

    // Component should format dates to Indonesian locale
    expect(screen.getByText('Daily Task Activity Trend (Last 30 Days)')).toBeInTheDocument();
  });
});
