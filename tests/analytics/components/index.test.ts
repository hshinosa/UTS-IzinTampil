import * as analyticsComponents from '../../../app/components/analytics/index';

// Mock the actual components
jest.mock('../../../app/components/analytics/DateRangeFilter', () => ({
  __esModule: true,
  default: 'MockDateRangeFilter'
}));

jest.mock('../../../app/components/analytics/AnalyticsContent', () => ({
  __esModule: true,
  default: 'MockAnalyticsContent'
}));

jest.mock('../../../app/components/analytics/AnalyticsSkeleton', () => ({
  __esModule: true,
  default: 'MockAnalyticsSkeleton'
}));

describe('Analytics Components Index', () => {
  it('exports DateRangeFilter component', () => {
    expect(analyticsComponents.DateRangeFilter).toBeDefined();
    expect(analyticsComponents.DateRangeFilter).toBe('MockDateRangeFilter');
  });

  it('exports AnalyticsContent component', () => {
    expect(analyticsComponents.AnalyticsContent).toBeDefined();
    expect(analyticsComponents.AnalyticsContent).toBe('MockAnalyticsContent');
  });

  it('exports AnalyticsSkeleton component', () => {
    expect(analyticsComponents.AnalyticsSkeleton).toBeDefined();
    expect(analyticsComponents.AnalyticsSkeleton).toBe('MockAnalyticsSkeleton');
  });

  it('exports exactly 3 components', () => {
    const exportedKeys = Object.keys(analyticsComponents);
    expect(exportedKeys).toHaveLength(3);
    expect(exportedKeys.sort()).toEqual(['AnalyticsContent', 'AnalyticsSkeleton', 'DateRangeFilter'].sort());
  });

  it('all exports are defined', () => {
    const { DateRangeFilter, AnalyticsContent, AnalyticsSkeleton } = analyticsComponents;
    
    expect(DateRangeFilter).toBeDefined();
    expect(AnalyticsContent).toBeDefined();
    expect(AnalyticsSkeleton).toBeDefined();
  });

  it('provides consistent export structure', () => {
    // Check that we can destructure all expected exports
    const exports = analyticsComponents;
    
    expect('DateRangeFilter' in exports).toBe(true);
    expect('AnalyticsContent' in exports).toBe(true);
    expect('AnalyticsSkeleton' in exports).toBe(true);
  });
});
