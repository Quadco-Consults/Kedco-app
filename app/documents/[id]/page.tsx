'use client';

import { useState, useEffect, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
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

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [recipientComment, setRecipientComment] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

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

  const handleTransfer = () => {
    console.log('Transferring to:', selectedDepartment, 'Notes:', transferNotes);
    setShowTransferModal(false);
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

            {/* Document Viewer */}
            {document.filePath && (
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Document Preview</h3>
                  <button
                    onClick={handleDownloadOriginal}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Open in New Tab
                  </button>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white overflow-hidden">
                  {document.mimeType?.includes('pdf') || document.fileName?.endsWith('.pdf') ? (
                    <iframe
                      src={document.filePath}
                      className="w-full h-[600px]"
                      title="Document Preview"
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
                  )}
                </div>
              </div>
            )}

            {/* Comments Section - For External Documents */}
            {document.comments && document.comments.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments & Reviews</h3>
                <div className="space-y-4">
                  {document.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-green-500 bg-green-50 p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.user.firstName} {comment.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{comment.user.role}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movement History */}
            {document.movements && document.movements.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Movement History</h3>
                <div className="relative">
                  <div className="space-y-6">
                    {document.movements.map((movement, index) => (
                      <div key={movement.id} className="relative flex gap-4">
                        {index !== (document.movements?.length || 0) - 1 && (
                          <div className="absolute left-4 top-8 h-full w-0.5 bg-gray-200" />
                        )}

                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        </div>

                        <div className="flex-1 pb-6">
                          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-2">
                              <p className="font-medium text-gray-900">
                                {movement.fromDepartment ? `${movement.fromDepartment} → ` : ''}{movement.toDepartment}
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
      </div>
    </DashboardLayout>
  );
}
