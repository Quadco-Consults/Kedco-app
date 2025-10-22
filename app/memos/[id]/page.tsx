'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [memo, setMemo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [approvalComments, setApprovalComments] = useState('');

  useEffect(() => {
    fetchMemo();
  }, [id]);

  const fetchMemo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/memos/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMemo(data);
      }
    } catch (error) {
      console.error('Error fetching memo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = async () => {
    try {
      const newStatus = approvalAction === 'approve' ? 'APPROVED' : 'REJECTED';

      const response = await fetch(`/api/memos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          approvedAt: approvalAction === 'approve' ? new Date().toISOString() : null,
        }),
      });

      if (response.ok) {
        // Refresh memo data
        fetchMemo();
      }
    } catch (error) {
      console.error('Error updating memo:', error);
    } finally {
      setShowApprovalModal(false);
      setApprovalComments('');
      setApprovalAction(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading memo...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!memo) {
    return (
      <DashboardLayout title="Not Found" subtitle="Memo not found">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">The requested memo could not be found.</p>
          <Link href="/memos" className="mt-4 inline-block text-green-600 hover:text-green-700">
            ← Back to Memos
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusText = memo.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const typeText = memo.type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const requiresApproval = memo.type === 'APPROVAL' || memo.type === 'EXTERNAL_LETTER';

  return (
    <DashboardLayout
      title={memo.referenceNumber}
      subtitle={`${typeText} Memo • ${statusText}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/memos"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Memos
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Memo Info Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{memo.subject}</h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-gray-900 ${
                      statusText === 'Approved'
                        ? 'bg-green-100'
                        : statusText === 'Rejected'
                        ? 'bg-red-100'
                        : statusText === 'Sent'
                        ? 'bg-green-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    {statusText}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-gray-900">
                    {typeText}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Created By</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {memo.createdBy.firstName} {memo.createdBy.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Department</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {memo.department?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(memo.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Priority</p>
                  <p className="mt-1 text-sm text-gray-900">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ${
                        memo.priority === 'URGENT'
                          ? 'bg-red-100'
                          : memo.priority === 'HIGH'
                          ? 'bg-orange-100'
                          : 'bg-yellow-100'
                      }`}
                    >
                      {memo.priority}
                    </span>
                  </p>
                </div>
                {memo.approvedAt && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Approved At</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(memo.approvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                {memo.sentAt && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Sent At</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(memo.sentAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Memo Content */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Memo Content</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{memo.body}</p>
              </div>
            </div>

            {/* Recipients */}
            {memo.recipients && memo.recipients.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recipients</h3>
                <div className="space-y-3">
                  {memo.recipients.map((recipient: any) => (
                    <div
                      key={recipient.id}
                      className={`rounded-lg border-2 p-4 ${
                        recipient.hasRead
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {recipient.user.firstName} {recipient.user.lastName}
                            </p>
                            {recipient.hasRead ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <ClockIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {recipient.user.role} - {recipient.user.department?.name}
                          </p>
                          {recipient.hasRead && recipient.readAt && (
                            <p className="mt-1 text-xs text-gray-500">
                              Read on {new Date(recipient.readAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Actions</h3>
              <div className="space-y-2">
                {requiresApproval && statusText === 'Pending Approval' && (
                  <>
                    <button
                      onClick={() => handleApproval('approve')}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Approve Memo
                    </button>
                    <button
                      onClick={() => handleApproval('reject')}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Reject Memo
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Memo Stats */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Recipients</span>
                  <span className="font-medium text-gray-900">
                    {memo.recipients?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Read</span>
                  <span className="font-medium text-gray-900">
                    {memo.recipients?.filter((r: any) => r.hasRead).length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Unread</span>
                  <span className="font-medium text-gray-900">
                    {memo.recipients?.filter((r: any) => !r.hasRead).length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {approvalAction === 'approve' ? 'Approve Memo' : 'Reject Memo'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {approvalAction === 'approve'
                  ? 'Are you sure you want to approve this memo?'
                  : 'Are you sure you want to reject this memo?'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comments (Optional)
                </label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={3}
                  placeholder="Add any comments or notes..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComments('');
                  setApprovalAction(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {approvalAction === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
