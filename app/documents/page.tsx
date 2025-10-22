'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import Link from 'next/link';
import {
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';

// Types for documents
interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  description?: string;
  currentDepartment: string;
  status: string;
  priority: string;
  isExternal: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  Pending: 'bg-gray-100 text-black',
  'In Transit': 'bg-yellow-100 text-black',
  'Under Review': 'bg-green-100 text-black',
  Received: 'bg-green-100 text-black',
  Archived: 'bg-green-100 text-black',
};

const recipients = [
  { id: '1', name: 'Managing Director', title: 'MD', department: 'MD Office' },
  { id: '2', name: 'Executive Director - Operations', title: 'ED Operations', department: 'Operations' },
  { id: '3', name: 'Executive Director - Finance', title: 'ED Finance', department: 'Finance' },
  { id: '4', name: 'Head of Human Resources', title: 'Head HR', department: 'Human Resources' },
  { id: '5', name: 'Head of Legal', title: 'Head Legal', department: 'Legal' },
  { id: '6', name: 'Head of IT', title: 'Head IT', department: 'IT' },
  { id: '7', name: 'Head of Internal Audit', title: 'Head IA', department: 'Internal Audit' },
];

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [uploading, setUploading] = useState(false);

  // Fetch documents
  useEffect(() => {
    fetchDocuments();
  }, [searchTerm, statusFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'All') params.append('status', statusFilter.replace(/ /g, '_').toUpperCase());

      const response = await fetch(`/api/documents?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleRecipientToggle = (recipientId: string) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleUpload = async () => {
    if (!uploadedFile || !documentTitle || !user) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('title', documentTitle);
      formData.append('description', documentDescription);
      formData.append('priority', priority);
      if (dueDate) formData.append('dueDate', dueDate);
      formData.append('createdById', user.id);
      formData.append('recipients', JSON.stringify(selectedRecipients));

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Reset form
        setShowUploadModal(false);
        setUploadedFile(null);
        setDocumentTitle('');
        setDocumentDescription('');
        setSelectedRecipients([]);
        setPriority('MEDIUM');
        setDueDate('');

        // Refresh documents list
        fetchDocuments();
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout title="Documents" subtitle="Track and manage document movements">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Transit">In Transit</option>
              <option value="Received">Received</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              Upload External Document
            </button>
            <Link
              href="/documents/new"
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <PlusIcon className="h-4 w-4" />
              New Document
            </Link>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Reference No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Current Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading documents...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-green-600">
                      <Link href={`/documents/${doc.id}`}>{doc.referenceNumber}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{doc.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {doc.currentDepartment}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold text-gray-900 ${
                          statusColors[doc.status as keyof typeof statusColors]?.split(' ')[0] || 'bg-gray-100'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {doc.createdBy}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {doc.updatedAt}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Link
                        href={`/documents/${doc.id}`}
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
            <span className="font-medium">{filteredDocuments.length}</span> of{' '}
            <span className="font-medium">{documents.length}</span> results
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

      {/* Upload External Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Upload External Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document File *
                </label>
                <div className="mt-2">
                  {!uploadedFile ? (
                    <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-green-400 hover:bg-green-50">
                      <ArrowUpTrayIcon className="mb-2 h-12 w-12 text-gray-400" />
                      <span className="text-sm font-medium text-gray-600">
                        Click to upload document
                      </span>
                      <span className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <PaperClipIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="e.g., Contract Proposal from XYZ Company"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief description of the document..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Recipients * (MD, EDs, Heads)
                </label>
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border border-gray-200 p-4">
                  {recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={() => handleRecipientToggle(recipient.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                        <p className="text-xs text-gray-500">
                          {recipient.title} - {recipient.department}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedRecipients.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedRecipients.length} recipient(s) selected
                  </p>
                )}
              </div>

              {/* Priority and Due Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date for Comments
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-green-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-green-900">
                  Document Workflow
                </h4>
                <ul className="space-y-1 text-xs text-green-800">
                  <li>• Document will be sent to selected recipients for review</li>
                  <li>• Recipients can add comments and suggestions</li>
                  <li>• After all comments are collected, a final PDF will be generated</li>
                  <li>• The final PDF will include all comments with timestamps and signatures</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadedFile || !documentTitle || selectedRecipients.length === 0 || uploading}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload & Send for Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
