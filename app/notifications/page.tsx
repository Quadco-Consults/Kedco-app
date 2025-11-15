'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BellIcon,
  DocumentIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'document' | 'memo' | 'approval' | 'system';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    category: 'approval',
    title: 'Approval Required',
    message: 'Equipment Purchase Request #2024-156 requires your approval within 2 days',
    actionText: 'Review & Approve',
    actionUrl: '/approvals/2024-156',
    isRead: false,
    createdAt: '2024-12-21T10:30:00Z',
    priority: 'high'
  },
  {
    id: '2',
    type: 'success',
    category: 'document',
    title: 'Document Approved',
    message: 'Your Budget Proposal 2024 has been approved by Finance Director',
    actionText: 'View Document',
    actionUrl: '/documents/budget-2024',
    isRead: false,
    createdAt: '2024-12-21T09:15:00Z',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'info',
    category: 'memo',
    title: 'New Memo Distribution',
    message: 'Monthly Safety Guidelines have been distributed to your department',
    actionText: 'Read Memo',
    actionUrl: '/memos/safety-guidelines',
    isRead: true,
    createdAt: '2024-12-21T08:45:00Z',
    priority: 'low'
  },
  {
    id: '4',
    type: 'warning',
    category: 'document',
    title: 'Document Due Soon',
    message: 'Project Report submission deadline is tomorrow',
    actionText: 'Submit Report',
    actionUrl: '/documents/project-report',
    isRead: false,
    createdAt: '2024-12-20T16:20:00Z',
    priority: 'high'
  },
  {
    id: '5',
    type: 'info',
    category: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur this weekend from 2-4 AM',
    isRead: true,
    createdAt: '2024-12-20T14:00:00Z',
    priority: 'low'
  }
];

const notificationIcons = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
};

const notificationColors = {
  info: 'bg-blue-100 text-blue-600 border-blue-200',
  warning: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  success: 'bg-green-100 text-green-600 border-green-200',
  error: 'bg-red-100 text-red-600 border-red-200',
};

const categoryIcons = {
  document: DocumentIcon,
  memo: EnvelopeIcon,
  approval: CheckCircleIcon,
  system: BellIcon,
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-600',
  high: 'bg-red-100 text-red-600',
};

function formatRelativeTime(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return time.toLocaleDateString();
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'document' | 'memo' | 'approval' | 'system'>('all');

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter =
      filter === 'all' ||
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'read' && notification.isRead);

    const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;

    return matchesReadFilter && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="Stay updated with system activities and important alerts"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
              </div>
              <BellIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actions Required</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {notifications.filter(n => n.actionText && !n.isRead).length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'unread'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'read'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="document">Documents</option>
              <option value="memo">Memos</option>
              <option value="approval">Approvals</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications ({filteredNotifications.length})
            </h3>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const NotificationIcon = notificationIcons[notification.type];
                const CategoryIcon = categoryIcons[notification.category];

                return (
                  <div
                    key={notification.id}
                    className={`p-6 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${notificationColors[notification.type]}`}>
                        <NotificationIcon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-gray-400" />
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[notification.priority]}`}>
                              {notification.priority}
                            </span>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full" />
                            )}
                          </div>
                        </div>

                        <p className={`text-sm mb-3 ${!notification.isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                            {notification.actionText && (
                              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                                {notification.actionText} →
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Mark as read"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete notification"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <button className="w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50">
                Load More Notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}