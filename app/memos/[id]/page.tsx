'use client';

import { useState, use } from 'react';
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

// Mock data - replace with API calls
const mockMemos = {
  '1': {
    id: '1',
    referenceNumber: 'MEM-2025-001',
    subject: 'Annual General Meeting',
    type: 'Internal',
    priority: 'High',
    status: 'Pending Approval',
    content: 'This is regarding the Annual General Meeting scheduled for next month...',
    recipientDepartment: 'All Departments',
    createdBy: 'MD Office',
    createdAt: '2025-10-20 10:00 AM',
    fileName: 'agm_memo.pdf',
    fileSize: '1.2 MB',
    fileUrl: null,
    requiresApproval: false,
  },
  '3': {
    id: '3',
    referenceNumber: 'MEM-2025-003',
    subject: 'Budget Approval Request',
    type: 'Approval',
    priority: 'High',
    status: 'Pending Approval',
    content: 'Requesting approval for FY 2025 budget allocation...',
    recipientDepartment: 'MD Office',
    createdBy: 'Finance',
    createdAt: '2025-10-18 09:30 AM',
    fileName: 'budget_approval_memo.pdf',
    fileSize: '1.8 MB',
    fileUrl: '/sample-memo-approval.html',
    requiresApproval: true,
    approver: 'Managing Director',
  },
  '4': {
    id: '4',
    referenceNumber: 'MEM-2025-004',
    subject: 'Response to Regulatory Authority',
    type: 'External Letter',
    priority: 'Urgent',
    status: 'Pending Approval',
    content: 'Response to NERC regarding regulatory compliance...',
    recipientDepartment: 'MD Office',
    createdBy: 'Legal',
    createdAt: '2025-10-21 02:00 PM',
    fileName: 'nerc_response_letter.pdf',
    fileSize: '2.1 MB',
    fileUrl: '/sample-memo-external-letter.html',
    requiresApproval: true,
    approver: 'Managing Director',
  },
};

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const memo = mockMemos[id as keyof typeof mockMemos] || mockMemos['3'];

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [memoStatus, setMemoStatus] = useState(memo.status);

  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (approvalAction === 'approve') {
      setMemoStatus('Approved');
      console.log('Memo approved with comments:', approvalComments);
    } else {
      setMemoStatus('Rejected');
      console.log('Memo rejected with comments:', approvalComments);
    }
    setShowApprovalModal(false);
    setApprovalComments('');
    setApprovalAction(null);
  };

  const handleViewMemo = () => {
    if (memo.fileUrl) {
      window.open(memo.fileUrl, '_blank');
    }
  };

  const handleDownloadMemo = () => {
    if (memo.fileUrl) {
      window.open(memo.fileUrl, '_blank');
    }
  };

  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Pending Approval': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Sent': 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-800',
    'Medium': 'bg-green-100 text-green-800',
    'High': 'bg-orange-100 text-orange-800',
    'Urgent': 'bg-red-100 text-red-800',
  };

  return (
    <DashboardLayout
      title={memo.referenceNumber}
      subtitle={`Memo Details • ${memoStatus}`}
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
          {/* Main Content - 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            {/* Memo Info Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{memo.subject}</h2>
                  <p className="mt-2 text-sm text-gray-600">{memo.content}</p>
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    statusColors[memoStatus as keyof typeof statusColors]
                  }`}>
                    {memoStatus}
                  </span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    priorityColors[memo.priority as keyof typeof priorityColors]
                  }`}>
                    {memo.priority}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Type</p>
                  <p className="mt-1 text-sm text-gray-900">{memo.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Created By</p>
                  <p className="mt-1 text-sm text-gray-900">{memo.createdBy}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">{memo.createdAt}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Recipients</p>
                  <p className="mt-1 text-sm text-gray-900">{memo.recipientDepartment}</p>
                </div>
                {memo.requiresApproval && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Requires Approval From</p>
                    <p className="mt-1 text-sm text-gray-900">{memo.approver}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Memo Viewer */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Memo Document</h3>
                <button
                  onClick={handleViewMemo}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Open in New Tab
                </button>
              </div>

              {/* Document Viewer Frame */}
              <div className="rounded-lg border-2 border-gray-200 bg-white overflow-hidden">
                {memo.fileUrl ? (
                  <iframe
                    src={memo.fileUrl}
                    className="w-full h-[700px]"
                    title="Memo Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center p-8 text-center bg-gray-50">
                    <div className="space-y-4">
                      <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{memo.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {memo.fileSize}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Document preview not available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-gray-500 text-center">
                <DocumentTextIcon className="inline h-4 w-4 mr-1" />
                {memo.fileName} ({memo.fileSize})
              </p>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleDownloadMemo}
                  className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download Memo
                </button>

                {/* Approval Actions - Only show if pending approval */}
                {memo.requiresApproval && memoStatus === 'Pending Approval' && (
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
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Reject Memo
                    </button>
                  </>
                )}

                {/* Approval Status - Show if approved or rejected */}
                {memoStatus === 'Approved' && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">Memo Approved</p>
                    </div>
                    <p className="text-xs text-green-800">
                      This memo has been approved and can now be sent to recipients.
                    </p>
                  </div>
                )}

                {memoStatus === 'Rejected' && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XMarkIcon className="h-5 w-5 text-red-600" />
                      <p className="text-sm font-semibold text-red-900">Memo Rejected</p>
                    </div>
                    <p className="text-xs text-red-800">
                      This memo has been rejected. Please review and resubmit.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Memo Info */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Memo Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">{memo.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium text-gray-900">{memo.fileSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {approvalAction === 'approve' ? 'Approve Memo' : 'Reject Memo'}
              </h3>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComments('');
                  setApprovalAction(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Document Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Memo:</p>
                <p className="text-sm text-gray-900">{memo.subject}</p>
                <p className="text-xs text-gray-600 mt-1">Ref: {memo.referenceNumber}</p>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments {approvalAction === 'reject' ? '(Required)' : '(Optional)'}
                </label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  rows={4}
                  placeholder={approvalAction === 'approve'
                    ? "Add any approval comments or notes..."
                    : "Please provide reasons for rejection..."}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Info */}
              <div className={`rounded-lg p-3 ${
                approvalAction === 'approve' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`text-xs ${
                  approvalAction === 'approve' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {approvalAction === 'approve'
                    ? "Once approved, this memo will be marked as approved and can be sent to recipients."
                    : "Rejecting this memo will return it to the creator for revision."}
                </p>
              </div>
            </div>

            {/* Actions */}
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
                disabled={approvalAction === 'reject' && !approvalComments.trim()}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {approvalAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
