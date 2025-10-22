'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ClockIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Approval {
  id: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  comments: string | null;
  order: number;
  approvedAt: string | null;
  approver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: { name: string } | null;
  };
}

interface Comment {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department: { name: string } | null;
  };
}

export default function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [memo, setMemo] = useState<any>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState<string | null>(null);
  const [approvalAction, setApprovalAction] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    fetchMemo();
    fetchApprovals();
    fetchComments();
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

  const fetchApprovals = async () => {
    try {
      const response = await fetch(`/api/memos/${id}/approvals`);
      if (response.ok) {
        const data = await response.json();
        setApprovals(data);
      }
    } catch (error) {
      console.error('Error fetching approvals:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/memos/${id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleApprovalClick = (approvalId: string, action: 'APPROVED' | 'REJECTED') => {
    setSelectedApprovalId(approvalId);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = async () => {
    if (!selectedApprovalId || !approvalAction) return;

    try {
      const response = await fetch(`/api/memos/${id}/approvals/${selectedApprovalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: approvalAction,
          comments: approvalComments || null,
        }),
      });

      if (response.ok) {
        await fetchMemo();
        await fetchApprovals();
        setShowApprovalModal(false);
        setApprovalComments('');
        setSelectedApprovalId(null);
        setApprovalAction(null);
      }
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const response = await fetch(`/api/memos/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          comment: newComment,
        }),
      });

      if (response.ok) {
        await fetchComments();
        setNewComment('');
        setShowCommentForm(false);
      } else {
        const errorData = await response.json();
        console.error('Error adding comment:', errorData);
        alert(`Failed to add comment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handlePdfPreview = async () => {
    if (pdfUrl) {
      setShowPdfPreview(true);
      return;
    }

    try {
      setDownloadingPdf(true);
      const response = await fetch(`/api/memos/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setShowPdfPreview(true);
      }
    } catch (error) {
      console.error('Error generating PDF preview:', error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePdfDownload = async () => {
    try {
      setDownloadingPdf(true);
      const response = await fetch(`/api/memos/${id}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `memo-${memo?.referenceNumber || id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setDownloadingPdf(false);
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

  // Find current user's pending approval
  const currentUserApproval = approvals.find(
    a => a.approverId === user?.id && a.status === 'PENDING'
  );

  return (
    <DashboardLayout
      title={memo.referenceNumber}
      subtitle={`${typeText} Memo • ${statusText}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/memos"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Memos
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePdfPreview}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 disabled:opacity-50"
            >
              <EyeIcon className="h-4 w-4" />
              {downloadingPdf ? 'Loading...' : 'Preview PDF'}
            </button>
            <button
              onClick={handlePdfDownload}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              {downloadingPdf ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

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
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      memo.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : memo.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : memo.status === 'SENT'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {statusText}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
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
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        memo.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800'
                          : memo.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : memo.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
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
              </div>
            </div>

            {/* Memo Content */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Memo Content</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{memo.body}</p>
              </div>
            </div>

            {/* Approval Workflow */}
            {approvals.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Approval Workflow</h3>
                <div className="space-y-4">
                  {approvals.map((approval, index) => (
                    <div
                      key={approval.id}
                      className={`rounded-lg border-2 p-4 ${
                        approval.status === 'APPROVED'
                          ? 'border-green-200 bg-green-50'
                          : approval.status === 'REJECTED'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                              {index + 1}
                            </span>
                            <p className="font-medium text-gray-900">
                              {approval.approver.firstName} {approval.approver.lastName}
                            </p>
                            {approval.status === 'APPROVED' && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            )}
                            {approval.status === 'REJECTED' && (
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            )}
                            {approval.status === 'PENDING' && (
                              <ClockIcon className="h-5 w-5 text-yellow-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {approval.approver.role} - {approval.approver.department?.name || 'N/A'}
                          </p>
                          {approval.approvedAt && (
                            <p className="mt-1 text-xs text-gray-500">
                              {approval.status === 'APPROVED' ? 'Approved' : 'Rejected'} on{' '}
                              {new Date(approval.approvedAt).toLocaleString()}
                            </p>
                          )}
                          {approval.comments && (
                            <p className="mt-2 rounded bg-gray-50 p-2 text-sm text-gray-700">
                              {approval.comments}
                            </p>
                          )}
                        </div>
                        {approval.id === currentUserApproval?.id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovalClick(approval.id, 'APPROVED')}
                              className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApprovalClick(approval.id, 'REJECTED')}
                              className="rounded-lg border border-red-600 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Comments & Minutes</h3>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  disabled={!user}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  Add Comment
                </button>
              </div>

              {showCommentForm && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    placeholder="Write your comment or minutes here..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowCommentForm(false);
                        setNewComment('');
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitComment}
                      disabled={!newComment.trim() || !user}
                      className="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet.</p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.user.firstName} {comment.user.lastName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {comment.user.role} - {comment.user.department?.name || 'N/A'}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
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
                {approvals.length > 0 && (
                  <>
                    <hr className="my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Approvals Pending</span>
                      <span className="font-medium text-yellow-600">
                        {approvals.filter(a => a.status === 'PENDING').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Approved</span>
                      <span className="font-medium text-green-600">
                        {approvals.filter(a => a.status === 'APPROVED').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rejected</span>
                      <span className="font-medium text-red-600">
                        {approvals.filter(a => a.status === 'REJECTED').length}
                      </span>
                    </div>
                  </>
                )}
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
                {approvalAction === 'APPROVED' ? 'Approve Memo' : 'Reject Memo'}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {approvalAction === 'APPROVED'
                  ? 'Are you sure you want to approve this memo?'
                  : 'Please provide a reason for rejecting this memo.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comments {approvalAction === 'REJECTED' && '(Required)'}
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
                  setSelectedApprovalId(null);
                  setApprovalAction(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={approvalAction === 'REJECTED' && !approvalComments.trim()}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                  approvalAction === 'APPROVED'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {approvalAction === 'APPROVED' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {showPdfPreview && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="flex h-full w-full max-w-6xl flex-col rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={pdfUrl}
                className="h-full w-full"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
