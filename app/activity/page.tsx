'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DocumentIcon,
  EnvelopeIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'document' | 'memo' | 'approval' | 'comment' | 'signature';
  title: string;
  description: string;
  user: {
    name: string;
    role: string;
  };
  timestamp: string;
  entity?: {
    id: string;
    title: string;
    type: string;
  };
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'document',
    title: 'New Document Uploaded',
    description: 'Annual Budget Report 2024 uploaded for review',
    user: { name: 'Sarah Johnson', role: 'Finance Manager' },
    timestamp: '2025-01-15T10:30:00Z',
    entity: { id: 'doc-1', title: 'Annual Budget Report 2024', type: 'Financial Document' }
  },
  {
    id: '2',
    type: 'approval',
    title: 'Approval Request Submitted',
    description: 'Equipment Purchase Request awaiting approval',
    user: { name: 'Michael Chen', role: 'IT Manager' },
    timestamp: '2025-01-15T09:45:00Z',
    entity: { id: 'app-1', title: 'Equipment Purchase Request', type: 'Purchase Request' }
  },
  {
    id: '3',
    type: 'memo',
    title: 'Memo Distributed',
    description: 'Monthly Safety Guidelines sent to all departments',
    user: { name: 'David Wilson', role: 'Safety Officer' },
    timestamp: '2025-01-15T08:20:00Z',
    entity: { id: 'memo-1', title: 'Monthly Safety Guidelines', type: 'Safety Memo' }
  },
  {
    id: '4',
    type: 'signature',
    title: 'Document Signed',
    description: 'Contract Agreement #2024-156 digitally signed',
    user: { name: 'Emily Rodriguez', role: 'Legal Counsel' },
    timestamp: '2025-01-15T07:15:00Z',
    entity: { id: 'doc-2', title: 'Contract Agreement #2024-156', type: 'Legal Contract' }
  },
  {
    id: '5',
    type: 'comment',
    title: 'Comment Added',
    description: 'Review comments added to Project Proposal Document',
    user: { name: 'James Anderson', role: 'Project Manager' },
    timestamp: '2025-01-14T16:30:00Z',
    entity: { id: 'doc-3', title: 'Q1 Project Proposal', type: 'Proposal Document' }
  }
];

const activityIcons = {
  document: DocumentIcon,
  memo: EnvelopeIcon,
  approval: CheckCircleIcon,
  comment: PencilSquareIcon,
  signature: PencilSquareIcon,
};

const activityColors = {
  document: 'bg-blue-100 text-blue-600 border-blue-200',
  memo: 'bg-green-100 text-green-600 border-green-200',
  approval: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  comment: 'bg-purple-100 text-purple-600 border-purple-200',
  signature: 'bg-indigo-100 text-indigo-600 border-indigo-200',
};

const filterOptions = [
  { value: 'all', label: 'All Activities' },
  { value: 'document', label: 'Documents' },
  { value: 'memo', label: 'Memos' },
  { value: 'approval', label: 'Approvals' },
  { value: 'comment', label: 'Comments' },
  { value: 'signature', label: 'Signatures' },
];

function formatRelativeTime(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return time.toLocaleDateString();
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const filteredActivities = activities.filter(activity =>
    filter === 'all' || activity.type === filter
  );

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout
      title="Recent Activity"
      subtitle="Track all system activities and user interactions"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4" />
              Filters
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">47</p>
              </div>
              <DocumentIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
              <UserIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">1,247</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Feed</h3>
            <p className="mt-1 text-sm text-gray-600">
              {filteredActivities.length} {filter === 'all' ? 'activities' : filter} found
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => {
              const IconComponent = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex items-start gap-4 p-6 hover:bg-gray-50 transition-colors">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${activityColors[activity.type]}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{activity.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {activity.user.name} ({activity.user.role})
                      </span>
                      {activity.entity && (
                        <span className="flex items-center gap-1">
                          <DocumentIcon className="h-3 w-3" />
                          {activity.entity.type}
                        </span>
                      )}
                    </div>
                  </div>

                  {activity.entity && (
                    <button className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                      <EyeIcon className="h-3 w-3" />
                      View
                      <ArrowRightIcon className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More */}
          <div className="border-t border-gray-200 px-6 py-4">
            <button className="w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50">
              Load More Activities
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}