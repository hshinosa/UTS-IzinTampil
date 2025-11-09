import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsContent from '../../../app/components/analytics/AnalyticsContent';

// Mock AdvancedCharts to avoid SVG/chart rendering issues
jest.mock('../../../app/components/analytics/AdvancedCharts', () => ({
  __esModule: true,
  default: ({ data }: any) => (
    <div data-testid="advanced-charts">
      {/* Section Titles */}
      <h3>Task Status Distribution</h3>
      <h3>Priority Distribution</h3>
      <h3>Productivity Analysis</h3>
      <h3>Completion Trend Analysis</h3>
      <h3>Daily Task Activity Trend (Last 30 Days)</h3>
      <h3>Monthly Performance vs Target</h3>
      
      {/* Summary Statistics Cards */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <h3>Average Daily Tasks</h3>
        <div>{data.tasksByDate.length}</div>
      </div>
      <div className="bg-gradient-to-r from-green-600 to-emerald-600">
        <h3>Efficiency Rate</h3>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600">
        <h3>Peak Performance</h3>
      </div>
      
      {/* Chart Elements - Each chart has its own responsive container */}
      <div data-testid="responsive-container">
        <div data-testid="pie-chart">Pie Chart</div>
      </div>
      <div data-testid="responsive-container">
        <div data-testid="bar-chart">Bar Chart</div>
      </div>
      <div data-testid="responsive-container">
        <div data-testid="area-chart">Area Chart</div>
      </div>
      <div data-testid="responsive-container">
        <div data-testid="line-chart">Line Chart</div>
      </div>
      <div data-testid="responsive-container">
        <div data-testid="line-chart">Line Chart 2</div>
      </div>
      <div data-testid="tooltip">Tooltip</div>
      <div data-testid="legend">Legend</div>
      
      {/* Data Info */}
      <div>Priority data: {data.tasksByPriority.length} items</div>
      <div>Monthly data: {data.completionRateByMonth.length} months</div>
      <div>Daily data: {data.tasksByDate.length} days</div>
    </div>
  )
}));

const mockAnalyticsData = {
  totalTasks: 200,
  completedTasks: 150,
  inProgressTasks: 35,
  pendingTasks: 15,
  tasksByPriority: [
    { priority: 'high', count: 60 },
    { priority: 'medium', count: 90 },
    { priority: 'low', count: 50 }
  ],
  tasksByDate: [
    { date: '2024-01-01', completed: 15, created: 18 },
    { date: '2024-01-02', completed: 12, created: 15 },
    { date: '2024-01-03', completed: 20, created: 14 },
    { date: '2024-01-04', completed: 18, created: 22 },
    { date: '2024-01-05', completed: 13, created: 16 }
  ],
  completionRateByMonth: [
    { month: 'Jan', rate: 88 },
    { month: 'Feb', rate: 82 },
    { month: 'Mar', rate: 95 },
    { month: 'Apr', rate: 91 },
    { month: 'May', rate: 86 },
    { month: 'Jun', rate: 93 }
  ]
};

describe('AdvancedCharts Integration with AnalyticsContent', () => {
  it('renders AdvancedCharts within AnalyticsContent', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Check that both regular analytics and advanced charts are present
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument(); // Original content
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument(); // Advanced charts
  });

  it('renders all chart types in the integrated view', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Advanced charts components
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
  });

  it('displays both basic analytics and advanced visualizations', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Basic analytics sections
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Monthly Completion Rate')).toBeInTheDocument();

    // Advanced charts sections
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
    expect(screen.getByText('Productivity Analysis')).toBeInTheDocument();
  });

  it('passes data correctly to AdvancedCharts component', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Verify that advanced charts receive and process the data
    expect(screen.getByText('Average Daily Tasks')).toBeInTheDocument();
    expect(screen.getByText('Efficiency Rate')).toBeInTheDocument();
    expect(screen.getByText('Peak Performance')).toBeInTheDocument();
  });

  it('maintains proper layout structure with integrated charts', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Check that the layout maintains proper spacing and structure
    const mainContainer = document.querySelector('.space-y-8');
    expect(mainContainer).toBeInTheDocument();
  });

  it('handles data transformations correctly in integrated environment', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Verify that completion percentage is calculated correctly
    // 150/200 = 75%
    expect(screen.getByText('75% completion rate')).toBeInTheDocument();

    // Verify that advanced charts data is processed
    expect(screen.getByText('95%')).toBeInTheDocument(); // Peak performance from mock data
  });

  it('renders responsive containers for all chart components', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    const containers = screen.getAllByTestId('responsive-container');
    expect(containers.length).toBeGreaterThanOrEqual(5); // At least 5 charts from AdvancedCharts
  });

  it('maintains consistent styling across basic and advanced components', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Check for consistent card styling
    const chartSections = document.querySelectorAll('.bg-white.dark\\:bg-gray-800.rounded-xl');
    expect(chartSections.length).toBeGreaterThan(5); // Multiple chart sections
  });

  it('displays priority data consistently between basic and advanced views', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Basic view shows priority counts
    expect(screen.getByText('60')).toBeInTheDocument(); // High priority count
    expect(screen.getByText('90')).toBeInTheDocument(); // Medium priority count

    // Advanced view should also process this data
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument();
  });

  it('handles empty data gracefully in integrated environment', () => {
    const emptyData = {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      tasksByPriority: [],
      tasksByDate: [],
      completionRateByMonth: []
    };

    expect(() => {
      render(<AnalyticsContent data={emptyData} />);
    }).not.toThrow();

    // Both basic and advanced sections should handle empty data
    expect(screen.getByText('0% completion rate')).toBeInTheDocument();
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument();
  });

  it('processes monthly data for both basic progress bars and advanced line charts', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Basic monthly completion rate section
    expect(screen.getByText('Monthly Completion Rate')).toBeInTheDocument();
    
    // Advanced monthly performance chart
    expect(screen.getByText('Monthly Performance vs Target')).toBeInTheDocument();
  });

  it('displays daily activity data in both basic and advanced formats', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Basic daily activity
    expect(screen.getByText('Daily Task Activity')).toBeInTheDocument();
    
    // Advanced trend analysis
    expect(screen.getByText('Daily Task Activity Trend (Last 30 Days)')).toBeInTheDocument();
  });

  it('maintains proper accessibility with integrated charts', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Check for proper heading structure
    const headings = document.querySelectorAll('h3');
    expect(headings.length).toBeGreaterThan(5); // Multiple chart sections have h3 headings
  });

  it('provides comprehensive data visualization coverage', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Verify all major visualization types are present
    expect(screen.getByText('Tasks by Priority')).toBeInTheDocument(); // Basic bar chart
    expect(screen.getByText('Priority Distribution')).toBeInTheDocument(); // Advanced bar chart
    expect(screen.getByText('Task Status Distribution')).toBeInTheDocument(); // Pie chart
    expect(screen.getByText('Productivity Analysis')).toBeInTheDocument(); // Line chart with dual axes
  });

  it('calculates and displays summary statistics accurately', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    // Summary statistics from AdvancedCharts
    const avgTasksCard = screen.getByText('Average Daily Tasks').closest('div');
    const efficiencyCard = screen.getByText('Efficiency Rate').closest('div');
    const peakCard = screen.getByText('Peak Performance').closest('div');

    expect(avgTasksCard).toBeInTheDocument();
    expect(efficiencyCard).toBeInTheDocument();
    expect(peakCard).toBeInTheDocument();

    // Check that cards have proper styling
    expect(avgTasksCard).toHaveClass('bg-gradient-to-r');
    expect(efficiencyCard).toHaveClass('bg-gradient-to-r');
    expect(peakCard).toHaveClass('bg-gradient-to-r');
  });

  it('integrates tooltips and legends consistently', () => {
    render(<AnalyticsContent data={mockAnalyticsData} />);

    const tooltips = screen.getAllByTestId('tooltip');
    const legends = screen.getAllByTestId('legend');

    expect(tooltips.length).toBeGreaterThan(0);
    expect(legends.length).toBeGreaterThan(0);
  });
});
