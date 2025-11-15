'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import {
  DocumentIcon,
  EnvelopeIcon,
  UserIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BookmarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface SearchResult {
  id: string;
  type: 'document' | 'memo' | 'user' | 'department';
  title: string;
  description: string;
  metadata: {
    author?: string;
    department?: string;
    date?: string;
    status?: string;
    size?: string;
    tags?: string[];
  };
  relevance: number;
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'document',
    title: 'Annual Budget Report 2024',
    description: 'Comprehensive financial analysis and budget allocation for the fiscal year 2024...',
    metadata: {
      author: 'Sarah Johnson',
      department: 'Finance',
      date: '2024-12-15',
      status: 'Under Review',
      size: '2.4 MB',
      tags: ['budget', 'finance', 'annual', 'report']
    },
    relevance: 95
  },
  {
    id: '2',
    type: 'memo',
    title: 'Safety Guidelines Update',
    description: 'Updated workplace safety protocols and emergency procedures...',
    metadata: {
      author: 'David Wilson',
      department: 'Safety',
      date: '2024-12-10',
      status: 'Published',
      tags: ['safety', 'guidelines', 'procedures']
    },
    relevance: 87
  },
  {
    id: '3',
    type: 'user',
    title: 'Michael Chen',
    description: 'IT Manager - Network Infrastructure, Security Systems, Database Management',
    metadata: {
      department: 'Information Technology',
      date: 'Last active: 2024-12-20',
      tags: ['it', 'manager', 'infrastructure']
    },
    relevance: 82
  },
  {
    id: '4',
    type: 'document',
    title: 'Project Timeline - Q1 2025',
    description: 'Detailed project milestones and deliverables for the first quarter...',
    metadata: {
      author: 'Emily Rodriguez',
      department: 'Project Management',
      date: '2024-12-18',
      status: 'In Progress',
      size: '1.2 MB',
      tags: ['project', 'timeline', 'milestones']
    },
    relevance: 78
  }
];

const savedSearches = [
  { id: '1', name: 'My Documents', query: 'author:me', count: 47 },
  { id: '2', name: 'Pending Approvals', query: 'status:pending type:approval', count: 12 },
  { id: '3', name: 'Finance Reports', query: 'department:finance type:report', count: 23 },
];

const recentSearches = [
  'budget 2024',
  'safety guidelines',
  'project timeline',
  'contract agreements',
  'user permissions'
];

const searchFilters = [
  { id: 'all', name: 'All Results', count: 156 },
  { id: 'documents', name: 'Documents', count: 89 },
  { id: 'memos', name: 'Memos', count: 34 },
  { id: 'users', name: 'People', count: 23 },
  { id: 'departments', name: 'Departments', count: 10 }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'document': return DocumentIcon;
    case 'memo': return EnvelopeIcon;
    case 'user': return UserIcon;
    case 'department': return BuildingOfficeIcon;
    default: return DocumentIcon;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'document': return 'bg-blue-100 text-blue-600 border-blue-200';
    case 'memo': return 'bg-green-100 text-green-600 border-green-200';
    case 'user': return 'bg-purple-100 text-purple-600 border-purple-200';
    case 'department': return 'bg-orange-100 text-orange-600 border-orange-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [results, setResults] = useState<SearchResult[]>(mockResults);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    // Simulate search API call
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const filteredResults = results.filter(result =>
    selectedFilter === 'all' ||
    (selectedFilter === 'documents' && result.type === 'document') ||
    (selectedFilter === 'memos' && result.type === 'memo') ||
    (selectedFilter === 'users' && result.type === 'user') ||
    (selectedFilter === 'departments' && result.type === 'department')
  );

  return (
    <DashboardLayout
      title="Global Search"
      subtitle="Search across all documents, memos, users, and departments"
    >
      <div className="space-y-6">
        {/* Search Header */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for documents, memos, people, or departments..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-lg focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={loading}
              className="rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="rounded-lg border border-gray-300 px-4 py-3 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <FunnelIcon className="h-5 w-5" />
              Advanced
            </button>
          </div>

          {/* Advanced Search */}
          {showAdvanced && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <AdvancedSearch onSearch={(filters) => console.log('Advanced search:', filters)} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Filters */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Results</h3>
              <div className="space-y-2">
                {searchFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      selectedFilter === filter.id
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{filter.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Searches */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Searches</h3>
              <div className="space-y-2">
                {savedSearches.map(search => (
                  <button
                    key={search.id}
                    onClick={() => handleSearch(search.query)}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <BookmarkIcon className="h-4 w-4" />
                      <span>{search.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{search.count}</span>
                  </button>
                ))}
              </div>
              <button className="mt-4 w-full text-sm text-green-600 hover:text-green-700">
                + Save Current Search
              </button>
            </div>

            {/* Recent Searches */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <ClockIcon className="h-4 w-4" />
                    <span className="truncate">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Search Results</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {filteredResults.length} results found
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select className="rounded border border-gray-300 px-2 py-1 text-sm">
                      <option>Relevance</option>
                      <option>Date</option>
                      <option>Title</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const IconComponent = getTypeIcon(result.type);
                  return (
                    <div key={result.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${getTypeColor(result.type)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-medium text-gray-900 hover:text-green-600 cursor-pointer">
                              {result.title}
                            </h4>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                              {result.type}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${result.relevance > 90 ? 'bg-green-500' : result.relevance > 70 ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                              <span className="text-xs text-gray-500">{result.relevance}% match</span>
                            </div>
                          </div>

                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {result.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                            {result.metadata.author && (
                              <span className="flex items-center gap-1">
                                <UserIcon className="h-3 w-3" />
                                {result.metadata.author}
                              </span>
                            )}
                            {result.metadata.department && (
                              <span className="flex items-center gap-1">
                                <BuildingOfficeIcon className="h-3 w-3" />
                                {result.metadata.department}
                              </span>
                            )}
                            {result.metadata.date && (
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                {result.metadata.date}
                              </span>
                            )}
                            {result.metadata.size && (
                              <span>{result.metadata.size}</span>
                            )}
                            {result.metadata.status && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                result.metadata.status === 'Published' ? 'bg-green-100 text-green-700' :
                                result.metadata.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {result.metadata.status}
                              </span>
                            )}
                          </div>

                          {result.metadata.tags && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {result.metadata.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing 1-{filteredResults.length} of {filteredResults.length} results
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}