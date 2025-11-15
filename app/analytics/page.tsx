'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ChartBarIcon,
  DocumentIcon,
  UserIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShareIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  documentMetrics: {
    totalDocuments: number;
    newDocuments: number;
    modifiedDocuments: number;
    deletedDocuments: number;
    archivedDocuments: number;
    sharedDocuments: number;
    documentsWithSignatures: number;
    documentsUnderReview: number;
  };
  userActivity: {
    activeUsers: number;
    totalUsers: number;
    newUsers: number;
    documentsViewed: number;
    documentsDownloaded: number;
    documentsShared: number;
    averageSessionTime: number;
    topUsers: {
      name: string;
      department: string;
      activity: number;
      lastActive: string;
    }[];
  };
  systemPerformance: {
    totalStorage: number;
    usedStorage: number;
    averageUploadTime: number;
    averageSearchTime: number;
    systemUptime: number;
    errorRate: number;
    bandwidth: number;
  };
  workflowMetrics: {
    totalWorkflows: number;
    activeWorkflows: number;
    completedWorkflows: number;
    overdueWorkflows: number;
    averageCompletionTime: number;
    approvalSuccess: number;
    reviewsCompleted: number;
    signaturesCompleted: number;
  };
  departmentBreakdown: {
    department: string;
    documentCount: number;
    userCount: number;
    storageUsed: number;
    activityScore: number;
  }[];
  timeSeriesData: {
    date: string;
    documents: number;
    users: number;
    storage: number;
    workflows: number;
  }[];
  securityMetrics: {
    failedLogins: number;
    suspiciousActivity: number;
    documentsWithRestrictions: number;
    encryptedDocuments: number;
    accessViolations: number;
    lastSecurityScan: string;
  };
}

const mockAnalyticsData: AnalyticsData = {
  documentMetrics: {
    totalDocuments: 15847,
    newDocuments: 234,
    modifiedDocuments: 456,
    deletedDocuments: 23,
    archivedDocuments: 1205,
    sharedDocuments: 3421,
    documentsWithSignatures: 567,
    documentsUnderReview: 89
  },
  userActivity: {
    activeUsers: 156,
    totalUsers: 234,
    newUsers: 12,
    documentsViewed: 2847,
    documentsDownloaded: 892,
    documentsShared: 445,
    averageSessionTime: 45,
    topUsers: [
      { name: 'Sarah Johnson', department: 'Finance', activity: 847, lastActive: '2025-01-15T14:30:00Z' },
      { name: 'Michael Chen', department: 'IT', activity: 692, lastActive: '2025-01-15T13:45:00Z' },
      { name: 'Emily Rodriguez', department: 'Legal', activity: 534, lastActive: '2025-01-15T15:20:00Z' },
      { name: 'David Wilson', department: 'Safety', activity: 421, lastActive: '2025-01-15T12:10:00Z' },
      { name: 'James Anderson', department: 'HR', activity: 389, lastActive: '2025-01-15T11:55:00Z' }
    ]
  },
  systemPerformance: {
    totalStorage: 5000,
    usedStorage: 3247,
    averageUploadTime: 2.3,
    averageSearchTime: 0.8,
    systemUptime: 99.8,
    errorRate: 0.2,
    bandwidth: 85
  },
  workflowMetrics: {
    totalWorkflows: 2847,
    activeWorkflows: 234,
    completedWorkflows: 2456,
    overdueWorkflows: 23,
    averageCompletionTime: 4.2,
    approvalSuccess: 94.5,
    reviewsCompleted: 567,
    signaturesCompleted: 423
  },
  departmentBreakdown: [
    { department: 'Finance', documentCount: 4523, userCount: 45, storageUsed: 892, activityScore: 94 },
    { department: 'Legal', documentCount: 2847, userCount: 23, storageUsed: 567, activityScore: 87 },
    { department: 'IT', documentCount: 2134, userCount: 34, storageUsed: 456, activityScore: 91 },
    { department: 'HR', documentCount: 1923, userCount: 28, storageUsed: 423, activityScore: 83 },
    { department: 'Operations', documentCount: 1756, userCount: 56, storageUsed: 345, activityScore: 78 },
    { department: 'Marketing', documentCount: 1234, userCount: 32, storageUsed: 289, activityScore: 72 },
    { department: 'Safety', documentCount: 987, userCount: 16, storageUsed: 234, activityScore: 89 }
  ],
  timeSeriesData: [
    { date: '2025-01-01', documents: 14856, users: 220, storage: 2890, workflows: 2234 },
    { date: '2025-01-02', documents: 14923, users: 225, storage: 2912, workflows: 2267 },
    { date: '2025-01-03', documents: 15067, users: 228, storage: 2956, workflows: 2301 },
    { date: '2025-01-04', documents: 15134, users: 230, storage: 2978, workflows: 2334 },
    { date: '2025-01-05', documents: 15201, users: 232, storage: 3001, workflows: 2367 },
    { date: '2025-01-06', documents: 15289, users: 234, storage: 3023, workflows: 2401 },
    { date: '2025-01-07', documents: 15367, users: 234, storage: 3045, workflows: 2435 },
    { date: '2025-01-08', documents: 15445, users: 234, storage: 3067, workflows: 2468 },
    { date: '2025-01-09', documents: 15523, users: 234, storage: 3089, workflows: 2502 },
    { date: '2025-01-10', documents: 15601, users: 234, storage: 3112, workflows: 2536 },
    { date: '2025-01-11', documents: 15678, users: 234, storage: 3134, workflows: 2569 },
    { date: '2025-01-12', documents: 15756, users: 234, storage: 3156, workflows: 2603 },
    { date: '2025-01-13', documents: 15789, users: 234, storage: 3178, workflows: 2637 },
    { date: '2025-01-14', documents: 15823, users: 234, storage: 3201, workflows: 2670 },
    { date: '2025-01-15', documents: 15847, users: 234, storage: 3247, workflows: 2847 }
  ],
  securityMetrics: {
    failedLogins: 23,
    suspiciousActivity: 5,
    documentsWithRestrictions: 2847,
    encryptedDocuments: 5634,
    accessViolations: 2,
    lastSecurityScan: '2025-01-15T02:00:00Z'
  }
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: any;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, change, icon: Icon, color, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : change < 0 ? (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
              ) : null}
              <span className={`text-xs ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );
}

interface SimpleBarChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

function SimpleBarChart({ data, title }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SimpleLineChartProps {
  data: { date: string; value: number }[];
  title: string;
  color: string;
}

function SimpleLineChart({ data, title, color }: SimpleLineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-32 flex items-end justify-between space-x-1">
        {data.map((item, index) => {
          const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full ${color} rounded-t`}
                style={{ height: `${Math.max(height, 5)}%` }}
              />
              <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatFileSize(bytes: number) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(uptime: number) {
  return `${uptime}%`;
}

export default function AnalyticsPage() {
  const [data] = useState<AnalyticsData>(mockAnalyticsData);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'documents' | 'users' | 'storage' | 'workflows'>('documents');

  const storagePercentage = (data.systemPerformance.usedStorage / data.systemPerformance.totalStorage) * 100;

  return (
    <DashboardLayout
      title="Analytics Dashboard"
      subtitle="Comprehensive insights into system usage and performance"
    >
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time metrics and analytics for your ECM system</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Documents"
            value={data.documentMetrics.totalDocuments}
            change={8.5}
            icon={DocumentIcon}
            color="text-blue-600"
            subtitle={`+${data.documentMetrics.newDocuments} this month`}
          />
          <MetricCard
            title="Active Users"
            value={data.userActivity.activeUsers}
            change={12.3}
            icon={UserIcon}
            color="text-green-600"
            subtitle={`${data.userActivity.totalUsers} total users`}
          />
          <MetricCard
            title="Storage Used"
            value={formatFileSize(data.systemPerformance.usedStorage * 1024 * 1024 * 1024)}
            change={5.7}
            icon={ArchiveBoxIcon}
            color="text-purple-600"
            subtitle={`${storagePercentage.toFixed(1)}% of total capacity`}
          />
          <MetricCard
            title="Active Workflows"
            value={data.workflowMetrics.activeWorkflows}
            change={-2.1}
            icon={ChartBarIcon}
            color="text-orange-600"
            subtitle={`${data.workflowMetrics.completedWorkflows} completed`}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Activity Trend */}
          <SimpleLineChart
            data={data.timeSeriesData.map(d => ({ date: d.date, value: d[selectedMetric] }))}
            title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend`}
            color="bg-blue-500"
          />

          {/* Department Breakdown */}
          <SimpleBarChart
            data={data.departmentBreakdown.map(d => ({
              label: d.department,
              value: d.documentCount,
              color: 'bg-green-500'
            }))}
            title="Documents by Department"
          />
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-green-600">{formatUptime(data.systemPerformance.systemUptime)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${data.systemPerformance.systemUptime}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium text-red-600">{data.systemPerformance.errorRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-red-500 rounded-full" style={{ width: `${data.systemPerformance.errorRate}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Bandwidth Usage</span>
                  <span className="font-medium text-yellow-600">{data.systemPerformance.bandwidth}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: `${data.systemPerformance.bandwidth}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Approval Success Rate</span>
                <span className="text-sm font-semibold text-green-600">{data.workflowMetrics.approvalSuccess}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Completion Time</span>
                <span className="text-sm font-semibold text-blue-600">{data.workflowMetrics.averageCompletionTime} days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews Completed</span>
                <span className="text-sm font-semibold text-purple-600">{data.workflowMetrics.reviewsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Signatures Collected</span>
                <span className="text-sm font-semibold text-orange-600">{data.workflowMetrics.signaturesCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overdue Workflows</span>
                <span className="text-sm font-semibold text-red-600">{data.workflowMetrics.overdueWorkflows}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Failed Logins</span>
                <span className="text-sm font-semibold text-red-600">{data.securityMetrics.failedLogins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Suspicious Activity</span>
                <span className="text-sm font-semibold text-orange-600">{data.securityMetrics.suspiciousActivity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Encrypted Documents</span>
                <span className="text-sm font-semibold text-green-600">{data.securityMetrics.encryptedDocuments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Access Violations</span>
                <span className="text-sm font-semibold text-red-600">{data.securityMetrics.accessViolations}</span>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">
                Last scan: {new Date(data.securityMetrics.lastSecurityScan).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* User Activity & Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Users */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
            <div className="space-y-3">
              {data.userActivity.topUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user.activity}</p>
                    <p className="text-xs text-gray-500">actions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
            <div className="space-y-3">
              {data.departmentBreakdown.map((dept, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <span className="text-sm text-gray-600">{dept.activityScore}% active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium text-gray-900">{dept.documentCount}</span> docs
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{dept.userCount}</span> users
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{formatFileSize(dept.storageUsed * 1024 * 1024)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className="h-1 bg-green-500 rounded-full"
                      style={{ width: `${dept.activityScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <EyeIcon className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-gray-500">Views</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{data.userActivity.documentsViewed.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Document views this month</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ArrowDownTrayIcon className="h-5 w-5 text-green-600" />
              <span className="text-xs text-gray-500">Downloads</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{data.userActivity.documentsDownloaded.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Files downloaded</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ShareIcon className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-gray-500">Shares</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{data.userActivity.documentsShared.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Documents shared</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <ClockIcon className="h-5 w-5 text-orange-600" />
              <span className="text-xs text-gray-500">Session Time</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{data.userActivity.averageSessionTime}m</p>
            <p className="text-sm text-gray-600">Average session length</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{data.systemPerformance.averageUploadTime}s</div>
              <div className="text-sm text-gray-600">Avg Upload Time</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{data.systemPerformance.averageSearchTime}s</div>
              <div className="text-sm text-gray-600">Avg Search Time</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{data.systemPerformance.systemUptime}%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${data.systemPerformance.systemUptime}%` }} />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{data.systemPerformance.errorRate}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="h-2 bg-red-500 rounded-full" style={{ width: `${data.systemPerformance.errorRate * 10}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Metric Selector for Charts */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trend Analysis</h3>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(['documents', 'users', 'storage', 'workflows'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1.5 text-sm ${
                    selectedMetric === metric
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Track how your {selectedMetric} have changed over the selected time period.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}