'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import PDFViewerWithComments from '@/components/PDFViewerWithComments';
import DigitalSignatureWorkflow from '@/components/signature/DigitalSignatureWorkflow';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PaperClipIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface DocumentComment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface DocumentMovement {
  id: string;
  action: string;
  movedAt: string;
  notes?: string;
  comments?: string;
  fromDepartment?: string;
  toDepartment?: string;
  movedBy: {
    firstName: string;
    lastName: string;
  };
}

interface DocumentDetail {
  id: string;
  title: string;
  referenceNumber: string;
  status: string;
  type?: string;
  description?: string;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  isExternal?: boolean;
  priority?: string;
  dueDate?: string;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  currentDepartment?: {
    id: string;
    name: string;
  };
  comments?: DocumentComment[];
  movements?: DocumentMovement[];
}

interface Recipient {
  id: string;
  name?: string;
  email?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  departmentId: string;
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [recipientComment, setRecipientComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  // New comment functionality
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [commentType, setCommentType] = useState('COMMENT'); // COMMENT, MINUTES, DECISION

  // Decision-making functionality
  const [decision, setDecision] = useState(''); // APPROVED, REJECTED, PENDING, REQUIRES_MORE_INFO
  const [routeToDepartment, setRouteToDepartment] = useState('');

  // User tagging functionality
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [taggedUser, setTaggedUser] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [actionDueDate, setActionDueDate] = useState('');

  // Tab functionality
  const [activeTab, setActiveTab] = useState('document'); // document, comments, history, signatures

  useEffect(() => {
    fetchDocument();
    fetchUsers();
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users?status=Active');
      if (response.ok) {
        const users = await response.json();
        setAvailableUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedDepartment || !user || !document) return;

    try {
      const response = await fetch(`/api/documents/${id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toDepartment: selectedDepartment,
          notes: transferNotes,
          movedById: user.id,
        }),
      });

      if (response.ok) {
        // Reset form and refresh document
        setSelectedDepartment('');
        setTransferNotes('');
        setShowTransferModal(false);
        await fetchDocument();
      } else {
        console.error('Failed to transfer document');
      }
    } catch (error) {
      console.error('Error transferring document:', error);
    }
  };

  const handleAddReview = () => {
    console.log('Adding review for recipient:', selectedRecipient?.name);
    console.log('Comment:', recipientComment);
    setShowCommentModal(false);
    setRecipientComment('');
    setSelectedRecipient(null);
  };

  const handleDownloadOriginal = () => {
    if (document?.filePath) {
      window.open(document.filePath, '_blank');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !document) return;

    try {
      setIsAddingComment(true);
      const response = await fetch(`/api/documents/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment.trim(),
          type: commentType,
          userId: user.id,
          decision: decision,
          routeToDepartment: routeToDepartment,
          taggedUserId: taggedUser || null,
          nextAction: nextAction || null,
          actionDueDate: actionDueDate || null,
        }),
      });

      if (response.ok) {
        // Reset form and refresh document
        setNewComment('');
        setShowAddComment(false);
        setCommentType('COMMENT');
        setDecision('');
        setRouteToDepartment('');
        setTaggedUser('');
        setNextAction('');
        setActionDueDate('');
        await fetchDocument();
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout title="Not Found" subtitle="Document not found">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-gray-600">The requested document could not be found.</p>
          <Link href="/documents" className="mt-4 inline-block text-green-600 hover:text-green-700">
            ← Back to Documents
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isExternal = document.isExternal || false;
  const statusText = document.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <DashboardLayout
      title={document.referenceNumber}
      subtitle={`Document Details • ${statusText}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Documents
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="space-y-6 lg:col-span-2">
            {/* Document Info Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{document.title}</h2>
                  {document.description && (
                    <p className="mt-2 text-sm text-gray-600">{document.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    statusText === 'Archived' ? 'bg-green-100 text-green-800' :
                    statusText === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                    statusText === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {statusText}
                  </span>
                  {isExternal && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                      External Document
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Created By</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {document.createdBy.firstName} {document.createdBy.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(document.createdAt).toLocaleString()}
                  </p>
                </div>
                {!isExternal && document.currentDepartment && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Current Department</p>
                    <p className="mt-1 text-sm text-gray-900">{document.currentDepartment.name}</p>
                  </div>
                )}
                {isExternal && document.priority && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Priority</p>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        document.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                        document.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        document.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {document.priority}
                      </span>
                    </p>
                  </div>
                )}
                {isExternal && document.dueDate && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Due Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(document.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {document.fileName && (
                  <div>
                    <p className="text-xs font-medium text-gray-500">Attachment</p>
                    <div className="mt-1 flex items-center gap-2">
                      <PaperClipIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {document.fileName} {document.fileSize && `(${(document.fileSize / 1024 / 1024).toFixed(2)} MB)`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabbed Interface */}
            <div className="rounded-lg bg-white shadow">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-6 pt-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('document')}
                    className={`border-b-2 pb-4 text-sm font-medium ${
                      activeTab === 'document'
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <DocumentTextIcon className="inline h-5 w-5 mr-2" />
                    Document
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`border-b-2 pb-4 text-sm font-medium ${
                      activeTab === 'comments'
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ChatBubbleLeftEllipsisIcon className="inline h-5 w-5 mr-2" />
                    Comments ({document.comments?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('signatures')}
                    className={`border-b-2 pb-4 text-sm font-medium ${
                      activeTab === 'signatures'
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <PencilIcon className="inline h-5 w-5 mr-2" />
                    Signatures
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`border-b-2 pb-4 text-sm font-medium ${
                      activeTab === 'history'
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ClockIcon className="inline h-5 w-5 mr-2" />
                    History ({document.movements?.length || 0})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'document' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                      {document.filePath && (
                        <button
                          onClick={handleDownloadOriginal}
                          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Open in New Tab
                        </button>
                      )}
                    </div>

                    <div className="rounded-lg border-2 border-gray-200 bg-white overflow-hidden">
                      {document.filePath ? (
                        document.mimeType?.includes('pdf') || document.fileName?.endsWith('.pdf') ? (
                          <PDFViewerWithComments
                            fileUrl={document.filePath}
                            comments={document.comments || []}
                            className="border-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center p-8 text-center bg-gray-50">
                            <div className="space-y-4">
                              <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{document.fileName}</p>
                                {document.fileSize && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Size: {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={handleDownloadOriginal}
                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                              >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                Download Document
                              </button>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center justify-center p-12 text-center bg-gray-50">
                          <div className="space-y-4">
                            <DocumentTextIcon className="mx-auto h-20 w-20 text-gray-300" />
                            <div>
                              <p className="text-lg font-medium text-gray-900">No Document File Uploaded</p>
                              <p className="text-sm text-gray-500 mt-2">
                                This document entry exists in the system but no file has been uploaded yet.
                              </p>
                            </div>
                            {user && (user.role === 'ADMIN' || user.role === 'MD') && (
                              <div className="pt-4">
                                <button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                  Upload Document File
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'signatures' && (
                  <DigitalSignatureWorkflow
                    documentId={document.id}
                    documentTitle={document.title}
                    onSignatureComplete={() => {
                      // Refresh document or handle signature completion
                      fetchDocument();
                    }}
                  />
                )}

                {activeTab === 'comments' && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Comments & Reviews</h3>
                      {user && (
                        <button
                          onClick={() => setShowAddComment(true)}
                          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add Comment
                        </button>
                      )}
                    </div>

                    {/* Add Comment Form */}
                    {showAddComment && (
                      <div className="mb-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comment Type
                          </label>
                          <select
                            value={commentType}
                            onChange={(e) => setCommentType(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          >
                            <option value="COMMENT">General Comment</option>
                            <option value="MINUTES">Official Minutes</option>
                            <option value="DECISION">Decision/Routing</option>
                          </select>
                        </div>

                        {/* Decision Options - Only show for DECISION type */}
                        {commentType === 'DECISION' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Decision
                              </label>
                              <select
                                value={decision}
                                onChange={(e) => setDecision(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="">Select Decision</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="REQUIRES_MORE_INFO">Requires More Information</option>
                                <option value="PENDING">Pending Further Review</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Route to Department (Optional)
                              </label>
                              <select
                                value={routeToDepartment}
                                onChange={(e) => setRouteToDepartment(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="">Keep in Current Department</option>
                                <option value="Finance">Finance Department</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="Operations">Operations</option>
                                <option value="IT">IT Department</option>
                                <option value="Legal">Legal Department</option>
                                <option value="Internal Audit">Internal Audit</option>
                                <option value="Procurement">Procurement</option>
                                <option value="MD Office">MD Office</option>
                              </select>
                            </div>
                          </>
                        )}

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your {commentType === 'MINUTES' ? 'Minutes' : commentType === 'DECISION' ? 'Decision Notes' : 'Comment'}
                          </label>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            placeholder={
                              commentType === 'MINUTES'
                                ? 'Enter official minutes or decision...'
                                : commentType === 'DECISION'
                                ? 'Route to department/user with instructions...'
                                : 'Enter your comment or review...'
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        </div>

                        {/* User Tagging and Next Action */}
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tag User for Next Action (Optional)
                            </label>
                            <select
                              value={taggedUser}
                              onChange={(e) => setTaggedUser(e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                              <option value="">Select user...</option>
                              {availableUsers.map((usr) => (
                                <option key={usr.id} value={usr.id}>
                                  {usr.firstName} {usr.lastName} - {usr.department}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Action Due Date (Optional)
                            </label>
                            <input
                              type="date"
                              value={actionDueDate}
                              onChange={(e) => setActionDueDate(e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        {taggedUser && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Next Action Required
                            </label>
                            <input
                              type="text"
                              value={nextAction}
                              onChange={(e) => setNextAction(e.target.value)}
                              placeholder="e.g., Review and provide feedback, Approve budget, etc."
                              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        )}

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setShowAddComment(false);
                              setNewComment('');
                              setCommentType('COMMENT');
                              setDecision('');
                              setRouteToDepartment('');
                              setTaggedUser('');
                              setNextAction('');
                              setActionDueDate('');
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || isAddingComment}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {isAddingComment ? 'Adding...' : 'Add Comment'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Display Comments */}
                    {document.comments && document.comments.length > 0 ? (
                      <div className="space-y-4">
                        {document.comments.map((comment) => (
                          <div key={comment.id} className="relative">
                            <div className={`border-l-4 p-4 rounded-r-lg ${
                              comment.comment.includes('[APPROVED]') ? 'border-green-500 bg-green-50' :
                              comment.comment.includes('[REJECTED]') ? 'border-red-500 bg-red-50' :
                              comment.comment.includes('[REQUIRES_MORE_INFO]') ? 'border-yellow-500 bg-yellow-50' :
                              comment.comment.includes('[PENDING]') ? 'border-blue-500 bg-blue-50' :
                              'border-gray-500 bg-gray-50'
                            }`}>
                              <div className="mb-3 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                                    comment.user.role === 'MD' ? 'bg-purple-600' :
                                    comment.user.role === 'DEPARTMENT_HEAD' ? 'bg-blue-600' :
                                    comment.user.role === 'ADMIN' ? 'bg-green-600' :
                                    comment.user.role === 'AUDITOR' ? 'bg-orange-600' :
                                    'bg-gray-600'
                                  }`}>
                                    {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {comment.user.firstName} {comment.user.lastName}
                                    </p>
                                    <p className="text-xs text-gray-600">{comment.user.role.replace(/_/g, ' ')}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </p>
                                  {(comment.comment.includes('[APPROVED]') ||
                                    comment.comment.includes('[REJECTED]') ||
                                    comment.comment.includes('[REQUIRES_MORE_INFO]') ||
                                    comment.comment.includes('[PENDING]')) && (
                                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                                      comment.comment.includes('[APPROVED]') ? 'bg-green-100 text-green-800' :
                                      comment.comment.includes('[REJECTED]') ? 'bg-red-100 text-red-800' :
                                      comment.comment.includes('[REQUIRES_MORE_INFO]') ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-blue-100 text-blue-800'
                                    }`}>
                                      {comment.comment.includes('[APPROVED]') ? 'APPROVED' :
                                       comment.comment.includes('[REJECTED]') ? 'REJECTED' :
                                       comment.comment.includes('[REQUIRES_MORE_INFO]') ? 'NEEDS INFO' :
                                       'PENDING'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="pl-11">
                                <p className="text-sm text-gray-800 leading-relaxed">
                                  {comment.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg bg-gray-50 p-8 text-center">
                        <ChatBubbleLeftEllipsisIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 mb-3">
                          No comments yet. Be the first to add your review or minutes.
                        </p>
                        {user && (
                          <button
                            onClick={() => setShowAddComment(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                          >
                            <PlusIcon className="h-4 w-4" />
                            Add First Comment
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && document.movements && document.movements.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Movement History</h3>
                    <div className="relative">
                      <div className="space-y-6">
                        {document.movements.map((movement, index) => (
                          <div key={movement.id} className="relative flex gap-4">
                            {index !== (document.movements?.length || 0) - 1 && (
                              <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200"></div>
                            )}

                            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            </div>

                            <div className="flex-1 pb-6">
                              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="mb-2">
                                  <p className="font-medium text-gray-900">
                                    {`${movement.fromDepartment ? movement.fromDepartment + ' → ' : ''}${movement.toDepartment}`}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Moved by {movement.movedBy.firstName} {movement.movedBy.lastName} on{' '}
                                    {new Date(movement.movedAt).toLocaleString()}
                                  </p>
                                </div>
                                {movement.comments && (
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Notes:</span> {movement.comments}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Actions</h3>
              <div className="space-y-2">
                {document.filePath && (
                  <button
                    onClick={handleDownloadOriginal}
                    className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    View/Download Document
                  </button>
                )}

                {user && (user.role === 'MD' || user.role === 'DEPARTMENT_HEAD' || user.role === 'ADMIN') && (
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="flex w-full items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    Route Document
                  </button>
                )}
              </div>
            </div>

            {/* Document Stats */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Movements</span>
                  <span className="font-medium text-gray-900">
                    {document.movements?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comments</span>
                  <span className="font-medium text-gray-900">
                    {document.comments?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-900">{statusText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer/Route Document Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Route Document</h3>
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Route to Department *
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select Department</option>
                    <option value="Finance">Finance Department</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">IT Department</option>
                    <option value="Legal">Legal Department</option>
                    <option value="Internal Audit">Internal Audit</option>
                    <option value="Procurement">Procurement</option>
                    <option value="MD Office">MD Office</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Routing Instructions
                  </label>
                  <textarea
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    rows={4}
                    placeholder="Add instructions, minutes, or decisions for the receiving department..."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-green-900">
                    Routing Process
                  </h4>
                  <ul className="space-y-1 text-xs text-green-800">
                    <li>• Document will be transferred to selected department</li>
                    <li>• Routing instructions will be visible to recipients</li>
                    <li>• Movement will be logged in document history</li>
                    <li>• Status will be updated automatically</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedDepartment('');
                    setTransferNotes('');
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransfer}
                  disabled={!selectedDepartment}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Route Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
