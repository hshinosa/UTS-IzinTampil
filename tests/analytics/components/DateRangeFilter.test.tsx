import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateRangeFilter from '../../../app/components/analytics/DateRangeFilter';

// Mock date to ensure consistent tests
const mockDate = new Date('2024-01-15');
const originalDate = Date;

beforeAll(() => {
  global.Date = jest.fn((...args) => {
    if (args.length === 0) {
      return mockDate;
    }
    return new originalDate(...args);
  }) as any;
  global.Date.now = originalDate.now;
  global.Date.UTC = originalDate.UTC;
  global.Date.parse = originalDate.parse;
  global.Date.prototype = originalDate.prototype;
});

afterAll(() => {
  global.Date = originalDate;
});

const mockDateRange = {
  startDate: '2024-01-01',
  endDate: '2024-01-15',
  preset: 'thisMonth'
};

const mockOnDateRangeChange = jest.fn();

describe('DateRangeFilter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial props', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    expect(screen.getByText('Filter Rentang Tanggal')).toBeInTheDocument();
    expect(screen.getByText('Pilih periode untuk melihat data analytics yang sesuai')).toBeInTheDocument();
    expect(screen.getByText('Periode Terpilih:')).toBeInTheDocument();
  });

  it('displays current range label correctly', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    // Get the specific text in the "Periode Terpilih" section
    const periodSection = screen.getByText('Periode Terpilih:').closest('div');
    expect(periodSection).toHaveTextContent('Bulan Ini');
  });

  it('renders all preset filter buttons', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    expect(screen.getByText('Semua Data')).toBeInTheDocument();
    expect(screen.getByText('Hari Ini')).toBeInTheDocument();
    expect(screen.getByText('Kemarin')).toBeInTheDocument();
    expect(screen.getByText('7 Hari Terakhir')).toBeInTheDocument();
    expect(screen.getByText('30 Hari Terakhir')).toBeInTheDocument();
    // Find buttons in the filter grid section
    const filterSection = screen.getByText('Filter Cepat').closest('div');
    expect(filterSection).toHaveTextContent('Bulan Ini');
    expect(screen.getByText('Bulan Lalu')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('shows active filter badge when filter is not "all"', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    expect(screen.getByText('Filter aktif')).toBeInTheDocument();
  });

  it('does not show active filter badge when preset is "all"', () => {
    const allDataRange = { ...mockDateRange, preset: 'all' };
    render(
      <DateRangeFilter 
        dateRange={allDataRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    expect(screen.queryByText('Filter aktif')).not.toBeInTheDocument();
  });

  it('calls onDateRangeChange when preset button is clicked', async () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    const todayButton = screen.getByText('Hari Ini');
    fireEvent.click(todayButton);

    // Wait for the timeout in handlePresetChange
    await waitFor(() => {
      expect(mockOnDateRangeChange).toHaveBeenCalledWith(
        expect.objectContaining({
          preset: 'today',
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      );
    }, { timeout: 500 });
  });

  it('opens custom date picker when Custom button is clicked', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    expect(screen.getByText('Atur Tanggal Custom')).toBeInTheDocument();
  });

  it('shows different button text based on preset state', () => {
    const customRange = { ...mockDateRange, preset: 'custom' };
    render(
      <DateRangeFilter 
        dateRange={customRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    expect(screen.getByText('Edit Custom Range')).toBeInTheDocument();
  });

  it('displays loading overlay when loading is true', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={true}
      />
    );

    expect(screen.getByText('Memuat Data...')).toBeInTheDocument();
  });

  it('disables buttons when loading', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('resets to default range when reset button is clicked', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    const resetButton = screen.getByTitle('Reset ke default (Semua Data)');
    fireEvent.click(resetButton);

    expect(mockOnDateRangeChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'all',
        startDate: '2020-01-01',
        endDate: expect.any(String)
      })
    );
  });

  it('handles custom date input changes', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    // Open custom date picker
    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    const dateInputs = screen.getAllByDisplayValue(mockDateRange.startDate);
    const startDateInput = dateInputs[0]; // First one should be start date
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });

    expect(startDateInput).toHaveValue('2024-01-01');
  });

  it('closes modal when cancel button is clicked', () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    // Open modal
    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    // Close modal
    const cancelButton = screen.getByText('Batal');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Atur Tanggal Custom')).not.toBeInTheDocument();
  });

  it('applies custom date range correctly', async () => {
    render(
      <DateRangeFilter 
        dateRange={mockDateRange}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    // Open modal
    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    // Set dates using input type selectors since labels aren't properly associated
    const dateInputs = screen.getAllByRole('textbox');
    const startDateInput = dateInputs.find(input => input.getAttribute('type') === 'date');
    const endDateInput = dateInputs.find((input, index) => 
      input.getAttribute('type') === 'date' && index > 0
    );
    
    if (startDateInput && endDateInput) {
      fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });
    }

    // Apply
    const applyButton = screen.getByText('Terapkan Filter');
    fireEvent.click(applyButton);

    // Wait for the timeout
    await waitFor(() => {
      expect(mockOnDateRangeChange).toHaveBeenCalledWith(
        expect.objectContaining({
          preset: 'custom',
          startDate: '2024-01-01',
          endDate: '2024-01-31'
        })
      );
    }, { timeout: 500 });
  });

  it('shows preview when both dates are selected in custom picker', () => {
    render(
      <DateRangeFilter 
        dateRange={{
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          preset: 'custom'
        }}
        onDateRangeChange={mockOnDateRangeChange}
        loading={false}
      />
    );

    // Open modal
    const customButton = screen.getByText('Custom');
    fireEvent.click(customButton);

    expect(screen.getByText('Preview Periode:')).toBeInTheDocument();
  });
});
