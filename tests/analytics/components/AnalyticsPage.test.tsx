import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsPage from '../../../app/analytics/page';

// Mock the child components
jest.mock('../../../app/components/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>
}));

jest.mock('../../../app/components/analytics/DateRangeFilter', () => {
  return function MockDateRangeFilter({ dateRange, onDateRangeChange, loading }: any) {
    return (
      <div data-testid="date-range-filter">
        <div>Current preset: {dateRange.preset}</div>
        <div>Date range: {dateRange.startDate} to {dateRange.endDate}</div>
        <button 
          onClick={() => onDateRangeChange({ 
            startDate: '2024-01-01', 
            endDate: '2024-01-31', 
            preset: 'thisMonth' 
          })}
        >
          Change Range
        </button>
        {loading && <div>Filter Loading...</div>}
      </div>
    );
  };
});

jest.mock('../../../app/components/analytics/AnalyticsContent', () => {
  return function MockAnalyticsContent({ data }: any) {
    return (
      <div data-testid="analytics-content">
        <div>Total Tasks: {data.totalTasks}</div>
        <div>Completed: {data.completedTasks}</div>
      </div>
    );
  };
});

jest.mock('../../../app/components/analytics/AnalyticsSkeleton', () => {
  return function MockAnalyticsSkeleton() {
    return <div data-testid="analytics-skeleton">Loading...</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

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
    { date: '1 Jan', completed: 5, created: 8 }
  ],
  completionRateByMonth: [
    { month: 'Jan', rate: 85 }
  ]
};

describe('AnalyticsPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAnalyticsData
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    render(<AnalyticsPage />);
    
    expect(screen.getByTestId('analytics-skeleton')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders main page content after loading', async () => {
    render(<AnalyticsPage />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('📊 Analytics Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Analisis mendalam terhadap performa dan tren tugas-tugas Anda dengan visualisasi data yang komprehensif')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('date-range-filter')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
  });

  it('initializes with correct default date range', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Current preset: all')).toBeInTheDocument();
    });

    expect(screen.getByText(/Date range: 2020-01-01 to/)).toBeInTheDocument();
  });

  it('fetches analytics data on mount', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analytics?startDate=2020-01-01&endDate=')
      );
    });
  });

  it('displays analytics content when data is loaded', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Tasks: 100')).toBeInTheDocument();
      expect(screen.getByText('Completed: 75')).toBeInTheDocument();
    });
  });

  it('handles date range change', async () => {
    render(<AnalyticsPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('date-range-filter')).toBeInTheDocument();
    });

    // Clear the previous fetch calls
    (fetch as jest.Mock).mockClear();

    // Trigger date range change
    const changeButton = screen.getByText('Change Range');
    fireEvent.click(changeButton);

    // Should update the display
    await waitFor(() => {
      expect(screen.getByText('Current preset: thisMonth')).toBeInTheDocument();
    });

    // Should make new API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/analytics?startDate=2024-01-01&endDate=2024-01-31')
      );
    });
  });

  it('displays error state when API call fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Analytics')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('displays error state when API returns non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500
    });

    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Analytics')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch analytics data')).toBeInTheDocument();
    });
  });

  it('handles unknown error types gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValue('String error');

    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error Loading Analytics')).toBeInTheDocument();
      expect(screen.getByText('Unknown error')).toBeInTheDocument();
    });
  });

  it('refetches data when date range changes', async () => {
    render(<AnalyticsPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
    });

    // Clear fetch mock to count new calls
    (fetch as jest.Mock).mockClear();

    // Change date range
    const changeButton = screen.getByText('Change Range');
    fireEvent.click(changeButton);

    // Should make new API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  it('passes loading state to DateRangeFilter', async () => {
    render(<AnalyticsPage />);
    
    // During initial loading
    expect(screen.queryByText('Filter Loading...')).not.toBeInTheDocument();
    
    // After loading completes
    await waitFor(() => {
      expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
    });
    
    // Should not show loading in filter after data loads
    expect(screen.queryByText('Filter Loading...')).not.toBeInTheDocument();
  });

  it('renders with proper page structure', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('📊 Analytics Dashboard')).toBeInTheDocument();
    });

    // Check for main container
    const mainContainer = document.querySelector('.min-h-screen.bg-gray-50.dark\\:bg-black');
    expect(mainContainer).toBeInTheDocument();

    // Check for content wrapper
    const contentWrapper = document.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8.py-8');
    expect(contentWrapper).toBeInTheDocument();
  });

  it('renders header with emoji and description', async () => {
    render(<AnalyticsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('📊 Analytics Dashboard')).toBeInTheDocument();
    });

    expect(screen.getByText('Analisis mendalam terhadap performa dan tren tugas-tugas Anda dengan visualisasi data yang komprehensif')).toBeInTheDocument();
  });
});
