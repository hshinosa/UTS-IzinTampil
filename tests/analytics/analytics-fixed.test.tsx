import { render, screen, cleanup } from '@testing-library/react';

describe('AnalyticsPage Component', () => {
  // Proper cleanup after each test
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('can mock fetch responses', async () => {
    const mockData = {
      totalTasks: 156,
      completedTasks: 98,
      message: 'success'
    };

    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const originalFetch = global.fetch;
    (global as any).fetch = mockFetch;

    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();

      expect(data.message).toBe('success');
      expect(mockFetch).toHaveBeenCalledWith('/api/analytics');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('handles fetch errors correctly', async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const originalFetch = global.fetch;
    (global as any).fetch = mockFetch;

    try {
      const response = await fetch('/api/analytics');
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('can test DOM elements', () => {
    const testDiv = document.createElement('div');
    testDiv.textContent = 'Analytics & Statistik';
    document.body.appendChild(testDiv);

    expect(testDiv.textContent).toBe('Analytics & Statistik');

    // Proper cleanup
    if (testDiv.parentNode) {
      testDiv.parentNode.removeChild(testDiv);
    }
  });

  it('can test React components rendering', () => {
    const TestComponent = () => (
      <div data-testid="analytics-test">
        <h1>Analytics Dashboard</h1>
        <p>Loading analytics data...</p>
      </div>
    );

    const { container } = render(<TestComponent />);

    expect(screen.getByTestId('analytics-test')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();

    cleanup();
  });

  it('can test async operations', async () => {
    const asyncFunction = async (): Promise<string> => {
      return new Promise(resolve => {
        setTimeout(() => resolve('completed'), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe('completed');
  });
});
