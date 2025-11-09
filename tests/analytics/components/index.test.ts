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

jest.mock('../../../app/components/analytics/AdvancedCharts', () => ({
  __esModule: true,
  default: 'MockAdvancedCharts'
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

  it('exports exactly 4 components', () => {
    const exportedKeys = Object.keys(analyticsComponents);
    expect(exportedKeys).toHaveLength(4);
    expect(exportedKeys.sort()).toEqual(['AdvancedCharts', 'AnalyticsContent', 'AnalyticsSkeleton', 'DateRangeFilter'].sort());
  });

  it('all exports are defined', () => {
    const { DateRangeFilter, AnalyticsContent, AnalyticsSkeleton, AdvancedCharts } = analyticsComponents;
    
    expect(DateRangeFilter).toBeDefined();
    expect(AnalyticsContent).toBeDefined();
    expect(AnalyticsSkeleton).toBeDefined();
    expect(AdvancedCharts).toBeDefined();
  });

  it('provides consistent export structure', () => {
    // Check that we can destructure all expected exports
    const exports = analyticsComponents;
    
    expect('DateRangeFilter' in exports).toBe(true);
    expect('AnalyticsContent' in exports).toBe(true);
    expect('AnalyticsSkeleton' in exports).toBe(true);
    expect('AdvancedCharts' in exports).toBe(true);
  });
});
