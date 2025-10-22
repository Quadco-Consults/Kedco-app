'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface Memo {
  id: string;
  referenceNumber: string;
  subject: string;
  body: string;
  type: string;
  typeRaw: string;
  priority: string;
  status: string;
  statusRaw: string;
  recipientDepartment: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const typeColors = {
  Internal: 'bg-green-100 text-green-800',
  'Audit Letter': 'bg-purple-100 text-purple-800',
  Approval: 'bg-green-100 text-green-800',
  'External Letter': 'bg-orange-100 text-orange-800',
  Circular: 'bg-indigo-100 text-indigo-800',
};

const priorityColors = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-green-100 text-green-800',
  High: 'bg-orange-100 text-orange-800',
  Urgent: 'bg-red-100 text-red-800',
};

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800',
  'Pending Approval': 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Sent: 'bg-green-100 text-green-800',
  Archived: 'bg-gray-100 text-gray-800',
};

export default function MemosPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchMemos();
  }, [searchTerm, typeFilter, statusFilter]);

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (typeFilter !== 'All') params.append('type', typeFilter.replace(/ /g, '_').toUpperCase());
      if (statusFilter !== 'All') params.append('status', statusFilter.replace(/ /g, '_').toUpperCase());

      const response = await fetch(`/api/memos?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMemos(data);
      }
    } catch (error) {
      console.error('Error fetching memos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMemos = memos.filter((memo) => {
    const matchesSearch =
      memo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memo.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || memo.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || memo.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout title="Memos" subtitle="Create and manage organizational memos">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search memos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="All">All Types</option>
              <option value="Internal">Internal</option>
              <option value="Approval">Approval</option>
              <option value="External Letter">External Letter</option>
              <option value="Audit Letter">Audit Letter</option>
              <option value="Circular">Circular</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Sent">Sent</option>
            </select>
          </div>

          {/* Create Memo Button */}
          <Link
            href="/memos/new"
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4" />
            Create Memo
          </Link>
        </div>

        {/* Memos Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reference No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading memos...
                  </td>
                </tr>
              ) : filteredMemos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                    No memos found
                  </td>
                </tr>
              ) : (
                filteredMemos.map((memo) => (
                  <tr key={memo.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                      <Link href={`/memos/${memo.id}`}>{memo.referenceNumber}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{memo.subject}</span>
                        {memo.priority === 'Urgent' && (
                          <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          typeColors[memo.type as keyof typeof typeColors]
                        }`}
                      >
                        {memo.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          priorityColors[memo.priority as keyof typeof priorityColors]
                        }`}
                      >
                        {memo.priority}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          statusColors[memo.status as keyof typeof statusColors]
                        }`}
                      >
                        {memo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {memo.recipientDepartment}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {memo.createdBy}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/memos/${memo.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between rounded-lg bg-white px-6 py-4 shadow">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{filteredMemos.length}</span> of{' '}
            <span className="font-medium">{memos.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
