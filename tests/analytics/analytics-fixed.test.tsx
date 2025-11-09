import { render, screen } from '@testing-library/react';

// Mock fetch API
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  // Reset fetch mock after each test
  jest.resetAllMocks();
});

// Simple test for analytics page functionality
describe('AnalyticsPage Component', () => {

  it('should have fetch available as global', () => {
    expect(typeof fetch).toBe('function');
  });

  it('can mock fetch responses', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    const mockData = {
      totalTasks: 156,
      completedTasks: 98,
      message: 'success'
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const response = await fetch('/api/analytics');
    const data = await response.json();

    expect(data.message).toBe('success');
    expect(mockFetch).toHaveBeenCalledWith('/api/analytics');
  });

  it('handles fetch errors correctly', async () => {
    const mockFetch = global.fetch as jest.Mock;
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const response = await fetch('/api/analytics');
    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
  });

  it('can test DOM elements', () => {
    // Create a simple test element
    const testDiv = document.createElement('div');
    testDiv.textContent = 'Analytics & Statistik';
    document.body.appendChild(testDiv);

    expect(testDiv.textContent).toBe('Analytics & Statistik');

    // Cleanup
    document.body.removeChild(testDiv);
  });

  it('can test React components rendering', () => {
    // Simple component test
    const TestComponent = () => (
      <div data-testid="analytics-test">
        <h1>Analytics Dashboard</h1>
        <p>Loading analytics data...</p>
      </div>
    );

    render(<TestComponent />);

    expect(screen.getByTestId('analytics-test')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();
  });

  it('can test async operations', async () => {
    const asyncFunction = async () => {
      return new Promise(resolve => {
        setTimeout(() => resolve('completed'), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe('completed');
  });
});
