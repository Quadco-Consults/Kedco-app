'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Approval {
  id: string;
  title: string;
  description: string;
  type: 'purchase' | 'document' | 'budget' | 'policy' | 'contract';
  amount?: number;
  currency?: string;
  requestedBy: {
    id: string;
    name: string;
    department: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  dueDate: string;
  createdAt: string;
  documents: string[];
  comments: number;
}

const mockApprovals: Approval[] = [
  {
    id: '1',
    title: 'IT Equipment Purchase Request',
    description: 'Request for new laptops and server infrastructure upgrade',
    type: 'purchase',
    amount: 245000,
    currency: 'NGN',
    requestedBy: {
      id: '1',
      name: 'Michael Chen',
      department: 'Information Technology'
    },
    priority: 'high',
    status: 'pending',
    dueDate: '2024-12-25T17:00:00Z',
    createdAt: '2024-12-20T09:30:00Z',
    documents: ['quote-1.pdf', 'specifications.docx'],
    comments: 2
  },
  {
    id: '2',
    title: 'Marketing Budget Allocation',
    description: 'Q1 2025 marketing campaign budget approval',
    type: 'budget',
    amount: 180000,
    currency: 'NGN',
    requestedBy: {
      id: '2',
      name: 'Sarah Johnson',
      department: 'Marketing'
    },
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-12-28T17:00:00Z',
    createdAt: '2024-12-19T14:15:00Z',
    documents: ['budget-proposal.xlsx', 'campaign-plan.pdf'],
    comments: 5
  },
  {
    id: '3',
    title: 'New Safety Policy Implementation',
    description: 'Updated workplace safety protocols and training requirements',
    type: 'policy',
    requestedBy: {
      id: '3',
      name: 'David Wilson',
      department: 'Safety & Compliance'
    },
    priority: 'critical',
    status: 'approved',
    dueDate: '2024-12-22T17:00:00Z',
    createdAt: '2024-12-18T11:00:00Z',
    documents: ['safety-policy-v2.pdf'],
    comments: 8
  },
  {
    id: '4',
    title: 'Vendor Contract Renewal',
    description: 'Annual cleaning services contract renewal',
    type: 'contract',
    amount: 120000,
    currency: 'NGN',
    requestedBy: {
      id: '4',
      name: 'Emily Rodriguez',
      department: 'Operations'
    },
    priority: 'low',
    status: 'rejected',
    dueDate: '2024-12-20T17:00:00Z',
    createdAt: '2024-12-15T16:45:00Z',
    documents: ['contract-draft.pdf', 'vendor-proposal.pdf'],
    comments: 3
  }
];

const typeColors = {
  purchase: 'bg-blue-100 text-blue-700 border-blue-200',
  document: 'bg-purple-100 text-purple-700 border-purple-200',
  budget: 'bg-green-100 text-green-700 border-green-200',
  policy: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  contract: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-800',
};

function formatCurrency(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

function formatRelativeTime(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = time.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays} days`;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);

  const filteredApprovals = approvals.filter(approval => {
    const matchesStatus = filter === 'all' || approval.status === filter;
    const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const stats = {
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    overdue: approvals.filter(a => new Date(a.dueDate) < new Date() && a.status === 'pending').length,
  };

  const handleApprove = (id: string) => {
    setApprovals(prev =>
      prev.map(approval =>
        approval.id === id ? { ...approval, status: 'approved' as const } : approval
      )
    );
  };

  const handleReject = (id: string) => {
    setApprovals(prev =>
      prev.map(approval =>
        approval.id === id ? { ...approval, status: 'rejected' as const } : approval
      )
    );
  };

  return (
    <DashboardLayout
      title="Approvals"
      subtitle="Review and manage approval requests requiring your action"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-yellow-600">{stats.pending}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
              </div>
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-red-600">{stats.overdue}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
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
                All ({approvals.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'approved'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Approved ({stats.approved})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filter === 'rejected'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
            Bulk Actions
          </button>
        </div>

        {/* Approvals List */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Approval Requests ({filteredApprovals.length})
            </h3>
          </div>

          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approval requests</h3>
              <p className="text-gray-600">No requests match your current filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApprovals.map((approval) => {
                const isOverdue = new Date(approval.dueDate) < new Date() && approval.status === 'pending';

                return (
                  <div
                    key={approval.id}
                    className={`p-6 transition-colors hover:bg-gray-50 ${isOverdue ? 'border-l-4 border-red-500 bg-red-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{approval.title}</h4>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${typeColors[approval.type]}`}>
                            {approval.type}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[approval.priority]}`}>
                            {approval.priority}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[approval.status]}`}>
                            {approval.status}
                          </span>
                          {isOverdue && (
                            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Overdue
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{approval.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4" />
                            <span>{approval.requestedBy.name} ({approval.requestedBy.department})</span>
                          </div>
                          {approval.amount && (
                            <div className="flex items-center gap-1">
                              <span>💰</span>
                              <span className="font-medium text-gray-900">
                                {formatCurrency(approval.amount, approval.currency)}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              {formatRelativeTime(approval.dueDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DocumentIcon className="h-4 w-4" />
                            <span>{approval.documents.length} documents</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>💬</span>
                            <span>{approval.comments} comments</span>
                          </div>
                        </div>

                        {approval.documents.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Attached documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {approval.documents.map((doc, index) => (
                                <button
                                  key={index}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  <DocumentIcon className="h-3 w-3" />
                                  {doc}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex flex-col gap-2">
                        {approval.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <XCircleIcon className="h-4 w-4" />
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedApproval(approval)}
                          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedApproval && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Approval Details</h3>
                <button
                  onClick={() => setSelectedApproval(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{selectedApproval.title}</h4>
                  <p className="text-gray-600">{selectedApproval.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Requested By</p>
                    <p className="text-gray-900">{selectedApproval.requestedBy.name}</p>
                    <p className="text-sm text-gray-600">{selectedApproval.requestedBy.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="text-gray-900">{formatRelativeTime(selectedApproval.dueDate)}</p>
                  </div>
                  {selectedApproval.amount && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Amount</p>
                      <p className="text-gray-900 font-semibold">
                        {formatCurrency(selectedApproval.amount, selectedApproval.currency)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedApproval.status]}`}>
                      {selectedApproval.status}
                    </span>
                  </div>
                </div>

                {selectedApproval.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        handleApprove(selectedApproval.id);
                        setSelectedApproval(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedApproval.id);
                        setSelectedApproval(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      Reject Request
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}