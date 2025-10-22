'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  DocumentIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalDocuments: number;
  pendingMemos: number;
  inTransitDocuments: number;
  completedToday: number;
  recentDocuments: Array<{
    id: string;
    title: string;
    department: string;
    status: string;
    date: string;
  }>;
  recentMemos: Array<{
    id: string;
    subject: string;
    type: string;
    sender: string;
    status: string;
    date: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      name: 'Total Documents',
      value: stats.totalDocuments.toString(),
      icon: DocumentIcon,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Pending Memos',
      value: stats.pendingMemos.toString(),
      icon: EnvelopeIcon,
      change: '-5%',
      changeType: 'negative',
    },
    {
      name: 'In Transit',
      value: stats.inTransitDocuments.toString(),
      icon: ClockIcon,
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Completed Today',
      value: stats.completedToday.toString(),
      icon: CheckCircleIcon,
      change: '+15%',
      changeType: 'positive',
    },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's what's happening today.">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.name} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Documents */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats?.recentDocuments.map((doc) => (
                <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{doc.title}</h3>
                      <p className="mt-1 text-sm text-gray-500">{doc.department}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        doc.status === 'Approved' || doc.status === 'Archived'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'In Transit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{doc.date}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 px-6 py-3">
              <Link href="/documents" className="text-sm font-medium text-green-600 hover:text-green-700">
                View all documents →
              </Link>
            </div>
          </div>

          {/* Recent Memos */}
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Memos</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {stats?.recentMemos.map((memo) => (
                <div key={memo.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{memo.subject}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {memo.type} • {memo.sender}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        memo.priority === 'Urgent' || memo.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800'
                          : memo.priority === 'High' || memo.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {memo.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">{memo.date}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 px-6 py-3">
              <Link href="/memos" className="text-sm font-medium text-green-600 hover:text-green-700">
                View all memos →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
