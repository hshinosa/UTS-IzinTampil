import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalyticsSkeleton from '../../../app/components/analytics/AnalyticsSkeleton';

// Mock the Navbar component
jest.mock('../../../app/components/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>
}));

describe('AnalyticsSkeleton Component', () => {
  it('renders without crashing', () => {
    render(<AnalyticsSkeleton />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders the main container with correct styling', () => {
    render(<AnalyticsSkeleton />);
    
    const container = document.querySelector('.min-h-screen.bg-gray-50.dark\\:bg-black');
    expect(container).toBeInTheDocument();
  });

  it('renders header skeleton elements', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for animated skeleton elements in header
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders date range filter skeleton section', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for gradient background of date range filter
    const dateRangeFilter = document.querySelector('.bg-gradient-to-br.from-white.via-blue-50.to-indigo-50');
    expect(dateRangeFilter).toBeInTheDocument();
  });

  it('renders 7 preset filter button skeletons plus 1 custom button', () => {
    render(<AnalyticsSkeleton />);
    
    // Find the grid container for filter buttons
    const filterGrid = document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-7');
    expect(filterGrid).toBeInTheDocument();
    
    // Should have 8 skeleton buttons (7 presets + 1 custom)
    const buttonSkeletons = filterGrid?.querySelectorAll('.h-10.bg-gray-200');
    expect(buttonSkeletons?.length).toBe(8);
  });

  it('renders 4 summary statistics skeleton cards', () => {
    render(<AnalyticsSkeleton />);
    
    // Find the grid container for statistics
    const statsGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
    expect(statsGrid).toBeInTheDocument();
    
    // Should have 4 statistic cards
    const statCards = statsGrid?.querySelectorAll('.bg-white.dark\\:bg-gray-800');
    expect(statCards?.length).toBe(4);
  });

  it('renders priority distribution skeleton section', () => {
    render(<AnalyticsSkeleton />);
    
    // Look for the 3-column grid for priorities
    const priorityGrid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    expect(priorityGrid).toBeInTheDocument();
    
    // Should have 3 priority skeleton items
    const priorityItems = priorityGrid?.querySelectorAll('.bg-gray-50.dark\\:bg-gray-700');
    expect(priorityItems?.length).toBe(3);
  });

  it('renders monthly completion rate skeleton bars', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for monthly rate skeleton elements (should be 6 months)
    const monthlyBars = document.querySelectorAll('.flex-1.bg-gray-200.dark\\:bg-gray-600.rounded-full.h-3');
    expect(monthlyBars.length).toBe(6);
  });

  it('renders daily activity skeleton items', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for daily activity items (should be 8)
    const dailyActivitySection = document.querySelector('.space-y-3');
    const dailyItems = dailyActivitySection?.querySelectorAll('.flex.items-center.justify-between.py-2');
    expect(dailyItems?.length).toBeGreaterThan(0);
  });

  it('has proper skeleton animation classes', () => {
    render(<AnalyticsSkeleton />);
    
    // All skeleton elements should have animate-pulse class
    const animatedElements = document.querySelectorAll('.animate-pulse');
    expect(animatedElements.length).toBeGreaterThan(10); // Should have many animated skeleton elements
  });

  it('renders with correct responsive classes', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for responsive classes
    expect(document.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8')).toBeInTheDocument();
  });

  it('renders skeleton cards with proper shadow and border styling', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for cards with shadow and border
    const skeletonCards = document.querySelectorAll('.shadow-lg.border.border-gray-200.dark\\:border-gray-700');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('renders different sized skeleton elements', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for different height skeleton elements
    expect(document.querySelector('.h-10')).toBeInTheDocument(); // Header skeleton
    expect(document.querySelector('.h-6')).toBeInTheDocument(); // Medium skeleton
    expect(document.querySelector('.h-4')).toBeInTheDocument(); // Small skeleton
    expect(document.querySelector('.h-8')).toBeInTheDocument(); // Large skeleton
  });

  it('maintains proper spacing between skeleton sections', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for space-y classes that maintain proper spacing
    expect(document.querySelector('.space-y-8')).toBeInTheDocument();
    expect(document.querySelector('.space-y-4')).toBeInTheDocument();
    expect(document.querySelector('.space-y-3')).toBeInTheDocument();
  });

  it('renders proper dark mode classes', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for dark mode classes
    expect(document.querySelector('.dark\\:bg-gray-800')).toBeInTheDocument();
    expect(document.querySelector('.dark\\:bg-gray-700')).toBeInTheDocument();
    expect(document.querySelector('.dark\\:border-gray-700')).toBeInTheDocument();
  });

  it('renders circular skeleton elements for icons', () => {
    render(<AnalyticsSkeleton />);
    
    // Check for circular skeleton elements (for icons)
    const circularSkeletons = document.querySelectorAll('.rounded-full.animate-pulse');
    expect(circularSkeletons.length).toBeGreaterThan(0);
  });
});
