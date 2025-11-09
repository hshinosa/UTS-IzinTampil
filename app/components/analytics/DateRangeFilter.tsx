'use client';

import React, { useState } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
  preset?: string;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  loading?: boolean;
}

export default function DateRangeFilter({ dateRange, onDateRangeChange, loading }: DateRangeFilterProps) {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(dateRange);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);

  const presetRanges = [
    {
      key: 'all',
      label: 'Semua Data',
      getDates: () => {
        return {
          startDate: '2020-01-01',
          endDate: new Date().toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'today', 
      label: 'Hari Ini', 
      getDates: () => {
        const today = new Date();
        return {
          startDate: today.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'yesterday', 
      label: 'Kemarin', 
      getDates: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: yesterday.toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'last7days', 
      label: '7 Hari Terakhir', 
      getDates: () => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return {
          startDate: sevenDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'last30days', 
      label: '30 Hari Terakhir', 
      getDates: () => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return {
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'thisMonth', 
      label: 'Bulan Ini', 
      getDates: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: firstDay.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      }
    },
    { 
      key: 'lastMonth', 
      label: 'Bulan Lalu', 
      getDates: () => {
        const today = new Date();
        const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: firstDayLastMonth.toISOString().split('T')[0],
          endDate: lastDayLastMonth.toISOString().split('T')[0]
        };
      }
    }
  ];

  const handlePresetChange = async (presetKey: string) => {
    const preset = presetRanges.find(p => p.key === presetKey);
    if (preset) {
      setIsApplyingFilter(true);
      const newRange = {
        ...preset.getDates(),
        preset: presetKey
      };
      setTempDateRange(newRange);
      
      setTimeout(() => {
        onDateRangeChange(newRange);
        setShowCustomRange(false);
        setShowDatePicker(false);
        setIsApplyingFilter(false);
      }, 300);
    }
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newRange = {
      ...tempDateRange,
      [field]: value,
      preset: 'custom'
    };
    setTempDateRange(newRange);
  };

  const applyCustomRange = () => {
    if (tempDateRange.startDate && tempDateRange.endDate) {
      setIsApplyingFilter(true);
      setTimeout(() => {
        onDateRangeChange(tempDateRange);
        setIsApplyingFilter(false);
        setShowDatePicker(false);
      }, 300);
    }
  };

  const resetToDefault = () => {
    const defaultRange = {
      startDate: '2020-01-01',
      endDate: new Date().toISOString().split('T')[0],
      preset: 'all'
    };
    setTempDateRange(defaultRange);
    onDateRangeChange(defaultRange);
    setShowCustomRange(false);
    setShowDatePicker(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCurrentRangeLabel = () => {
    if (dateRange.preset && dateRange.preset !== 'custom') {
      const preset = presetRanges.find(p => p.key === dateRange.preset);
      return preset?.label || 'Range Custom';
    }
    return `${formatDisplayDate(dateRange.startDate)} - ${formatDisplayDate(dateRange.endDate)}`;
  };

  const isFilterActive = () => {
    return dateRange.preset !== 'all';
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-4 8V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 8h16m-2-4V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
              </svg>
              <span>Filter Rentang Tanggal</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              Pilih periode untuk melihat data analytics yang sesuai
            </p>
          </div>

          {/* Current Range Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Periode Terpilih:</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{getCurrentRangeLabel()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            disabled={loading || isApplyingFilter}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            <span>
              {showDatePicker 
                ? 'Tutup Filter' 
                : dateRange.preset === 'custom' 
                  ? 'Edit Custom Range'
                  : 'Custom Filter'
              }
            </span>
          </button>
          
          <button
            onClick={resetToDefault}
            disabled={loading || isApplyingFilter}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Reset ke default (Semua Data)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {/* Loading Overlay */}
        {(loading || isApplyingFilter) && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg flex items-center justify-center z-10">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {isApplyingFilter ? 'Menerapkan Filter...' : 'Memuat Data...'}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter Cepat</span>
          </h4>
          {isFilterActive() && (
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              Filter aktif
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
          {presetRanges.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePresetChange(preset.key)}
              disabled={loading || isApplyingFilter}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                dateRange.preset === preset.key
                  ? preset.key === 'all' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg ring-2 ring-green-300 scale-105'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-2 ring-blue-300 scale-105'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
              } ${(loading || isApplyingFilter) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className="flex items-center justify-center space-x-1">
                <span className="text-center">{preset.label}</span>
                {dateRange.preset === preset.key && (
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            disabled={loading || isApplyingFilter}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-1 ${
              dateRange.preset === 'custom'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-purple-300 scale-105'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-dashed border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm'
            } ${(loading || isApplyingFilter) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-center">Custom</span>
            {dateRange.preset === 'custom' && (
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Custom Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h8a2 2 0 012 2v4m-4 8V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 8h16m-2-4V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2" />
                  </svg>
                  <span>Atur Tanggal Custom</span>
                </h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🗓️ Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={tempDateRange.startDate}
                    onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                    max={tempDateRange.endDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    🏁 Tanggal Akhir
                  </label>
                  <input
                    type="date"
                    value={tempDateRange.endDate}
                    onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                    min={tempDateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                </div>

                {/* Preview */}
                {tempDateRange.startDate && tempDateRange.endDate && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview Periode:</h4>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatDisplayDate(tempDateRange.startDate)} - {formatDisplayDate(tempDateRange.endDate)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {Math.ceil((new Date(tempDateRange.endDate).getTime() - new Date(tempDateRange.startDate).getTime()) / (1000 * 60 * 60 * 24))} hari
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    disabled={loading || isApplyingFilter}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={applyCustomRange}
                    disabled={loading || isApplyingFilter || !tempDateRange.startDate || !tempDateRange.endDate}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isApplyingFilter ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menerapkan...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Terapkan Filter
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
