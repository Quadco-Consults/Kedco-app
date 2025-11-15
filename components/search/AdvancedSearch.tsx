'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentIcon,
  TagIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  query: string;
  status: string[];
  priority: string[];
  departments: string[];
  creators: string[];
  dateRange: {
    from: string;
    to: string;
  };
  fileTypes: string[];
  tags: string[];
  isExternal?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  referenceNumber: string;
  status: string;
  priority: string;
  department: string;
  creator: string;
  createdAt: string;
  isExternal: boolean;
  fileName?: string;
  excerpt?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AdvancedSearchProps {
  onSearchResults: (results: SearchResult[]) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export default function AdvancedSearch({
  onSearchResults,
  onFiltersChange,
  className = ''
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    status: [],
    priority: [],
    departments: [],
    creators: [],
    dateRange: { from: '', to: '' },
    fileTypes: [],
    tags: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [facetCounts, setFacetCounts] = useState<Record<string, FilterOption[]>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');

  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
    loadSavedSearches();
  }, []);

  useEffect(() => {
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const loadSavedSearches = () => {
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  };

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const searchParams = new URLSearchParams();

      if (filters.query) searchParams.append('q', filters.query);
      if (filters.status.length > 0) searchParams.append('status', filters.status.join(','));
      if (filters.priority.length > 0) searchParams.append('priority', filters.priority.join(','));
      if (filters.departments.length > 0) searchParams.append('departments', filters.departments.join(','));
      if (filters.creators.length > 0) searchParams.append('creators', filters.creators.join(','));
      if (filters.dateRange.from) searchParams.append('dateFrom', filters.dateRange.from);
      if (filters.dateRange.to) searchParams.append('dateTo', filters.dateRange.to);
      if (filters.fileTypes.length > 0) searchParams.append('fileTypes', filters.fileTypes.join(','));
      if (filters.isExternal !== undefined) searchParams.append('isExternal', filters.isExternal.toString());

      const response = await fetch(`/api/search/documents?${searchParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setFacetCounts(data.facets);
        onSearchResults(data.results);
        onFiltersChange(filters);
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleFilterValue = (filterKey: keyof SearchFilters, value: string) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    updateFilter(filterKey, newValues);
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      status: [],
      priority: [],
      departments: [],
      creators: [],
      dateRange: { from: '', to: '' },
      fileTypes: [],
      tags: []
    });
  };

  const saveSearch = () => {
    if (!searchName.trim()) return;

    const newSaved = [...savedSearches, searchName];
    setSavedSearches(newSaved);
    localStorage.setItem('savedSearches', JSON.stringify(newSaved));
    localStorage.setItem(`search_${searchName}`, JSON.stringify(filters));
    setSearchName('');
    setShowSaveDialog(false);
  };

  const loadSavedSearch = (name: string) => {
    const saved = localStorage.getItem(`search_${name}`);
    if (saved) {
      setFilters(JSON.parse(saved));
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.departments.length > 0) count++;
    if (filters.creators.length > 0) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.fileTypes.length > 0) count++;
    if (filters.isExternal !== undefined) count++;
    return count;
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IN_TRANSIT', label: 'In Transit', color: 'bg-blue-100 text-blue-800' },
    { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
    { value: 'RECEIVED', label: 'Received', color: 'bg-green-100 text-green-800' },
    { value: 'ARCHIVED', label: 'Archived', color: 'bg-gray-100 text-gray-800' }
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const fileTypeOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'Word Document' },
    { value: 'docx', label: 'Word Document (Modern)' },
    { value: 'xls', label: 'Excel' },
    { value: 'xlsx', label: 'Excel (Modern)' },
    { value: 'ppt', label: 'PowerPoint' },
    { value: 'pptx', label: 'PowerPoint (Modern)' }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents, content, reference numbers..."
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-20 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          {isSearching && (
            <div className="absolute right-16 h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-r-transparent" />
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`absolute right-2 flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              showAdvanced || getActiveFilterCount() > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Advanced Search Filters</h3>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowSaveDialog(true)}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Save Search
              </button>
              <button
                onClick={() => setShowAdvanced(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Status Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <TagIcon className="h-4 w-4" />
                Status
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {statusOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(option.value)}
                      onChange={() => toggleFilterValue('status', option.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                      {option.label}
                    </span>
                    {facetCounts.status && (
                      <span className="text-xs text-gray-500">
                        ({facetCounts.status.find(f => f.value === option.value)?.count || 0})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <TagIcon className="h-4 w-4" />
                Priority
              </label>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.priority.includes(option.value)}
                      onChange={() => toggleFilterValue('priority', option.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                      {option.label}
                    </span>
                    {facetCounts.priority && (
                      <span className="text-xs text-gray-500">
                        ({facetCounts.priority.find(f => f.value === option.value)?.count || 0})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <BuildingOfficeIcon className="h-4 w-4" />
                Departments
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {departments.map((dept) => (
                  <label key={dept.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.departments.includes(dept.name)}
                      onChange={() => toggleFilterValue('departments', dept.name)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{dept.name}</span>
                    {facetCounts.departments && (
                      <span className="text-xs text-gray-500">
                        ({facetCounts.departments.find(f => f.value === dept.name)?.count || 0})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <CalendarIcon className="h-4 w-4" />
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, from: e.target.value })}
                  placeholder="From"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <input
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, to: e.target.value })}
                  placeholder="To"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            {/* File Type Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <DocumentIcon className="h-4 w-4" />
                File Types
              </label>
              <div className="space-y-2">
                {fileTypeOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.fileTypes.includes(option.value)}
                      onChange={() => toggleFilterValue('fileTypes', option.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {facetCounts.fileTypes && (
                      <span className="text-xs text-gray-500">
                        ({facetCounts.fileTypes.find(f => f.value === option.value)?.count || 0})
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Document Type Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <DocumentIcon className="h-4 w-4" />
                Document Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isExternal"
                    checked={filters.isExternal === false}
                    onChange={() => updateFilter('isExternal', false)}
                    className="border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Internal Documents</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isExternal"
                    checked={filters.isExternal === true}
                    onChange={() => updateFilter('isExternal', true)}
                    className="border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">External Documents</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isExternal"
                    checked={filters.isExternal === undefined}
                    onChange={() => updateFilter('isExternal', undefined)}
                    className="border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">All Documents</span>
                </label>
              </div>
            </div>
          </div>

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Saved Searches</h4>
              <div className="flex flex-wrap gap-2">
                {savedSearches.map((searchName) => (
                  <button
                    key={searchName}
                    onClick={() => loadSavedSearch(searchName)}
                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
                  >
                    {searchName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Save Search</h3>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && saveSearch()}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSearch}
                className="flex-1 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{getActiveFilterCount()} active filter{getActiveFilterCount() > 1 ? 's' : ''}:</span>
          {filters.status.length > 0 && (
            <span className="rounded bg-green-100 px-2 py-1 text-green-700">
              Status ({filters.status.length})
            </span>
          )}
          {filters.priority.length > 0 && (
            <span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
              Priority ({filters.priority.length})
            </span>
          )}
          {filters.departments.length > 0 && (
            <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">
              Departments ({filters.departments.length})
            </span>
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <span className="rounded bg-orange-100 px-2 py-1 text-orange-700">
              Date Range
            </span>
          )}
          {filters.fileTypes.length > 0 && (
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">
              File Types ({filters.fileTypes.length})
            </span>
          )}
        </div>
      )}

      {/* Search Results Count */}
      {searchResults.length > 0 && (
        <div className="text-sm text-gray-600">
          Found {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
          {filters.query && ` for "${filters.query}"`}
        </div>
      )}
    </div>
  );
}