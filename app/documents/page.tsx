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
import AdvancedFileUpload from '@/components/ui/AdvancedFileUpload';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import BulkOperations from '@/components/operations/BulkOperations';

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

  // Bulk operations state
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showBulkOperations, setShowBulkOperations] = useState(false);

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
        {/* Advanced Search */}
        <AdvancedSearch
          onSearchResults={(results) => {
            // Transform search results to match Document interface if needed
            const transformedResults = results.map(result => ({
              id: result.id,
              referenceNumber: result.referenceNumber,
              title: result.title,
              description: '', // Add if needed
              currentDepartment: result.department,
              status: result.status,
              priority: result.priority,
              isExternal: result.isExternal,
              createdBy: result.creator,
              createdAt: result.createdAt,
              updatedAt: result.createdAt // Use same as created for now
            }));
            setDocuments(transformedResults);
          }}
          onFiltersChange={(filters) => {
            // Update search term for compatibility with existing code
            setSearchTerm(filters.query);
            setStatusFilter(filters.status.length > 0 ? filters.status[0] : 'All');
          }}
        />

        {/* Action Buttons - Moved after search */}
        <div className="flex justify-end gap-3">
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

        {/* Bulk Operations */}
        {selectedDocuments.length > 0 && (
          <BulkOperations
            selectedItems={selectedDocuments}
            onOperationComplete={(operation, itemIds) => {
              // Handle bulk operation completion
              console.log(`Bulk ${operation} completed for:`, itemIds);
              setSelectedDocuments([]);
              // Refresh documents list if needed
              fetchDocuments();
            }}
            onCancel={() => setSelectedDocuments([])}
          />
        )}

        {/* Documents Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-lg bg-white p-8 shadow text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent mb-4"></div>
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="rounded-lg bg-white p-12 shadow text-center">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30a9.971 9.971 0 018.287 6.286" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-500">Get started by creating your first document or adjusting your search filters.</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments([...selectedDocuments, doc.id]);
                        } else {
                          setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                        <span className="text-sm font-medium text-green-600">{doc.referenceNumber}</span>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          doc.status === 'ARCHIVED' ? 'bg-green-100 text-green-800' :
                          doc.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-800' :
                          doc.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                        {doc.isExternal && (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            External
                          </span>
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>
                          <span className="font-medium">Department:</span> {doc.isExternal ? 'External' : doc.currentDepartment}
                        </span>
                        <span>
                          <span className="font-medium">Created by:</span> {doc.createdBy.firstName} {doc.createdBy.lastName}
                        </span>
                        <span>
                          <span className="font-medium">Updated:</span> {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
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
              {/* Advanced File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document File *
                </label>
                <AdvancedFileUpload
                  onFileSelect={setUploadedFile}
                  onFileRemove={() => setUploadedFile(null)}
                  selectedFile={uploadedFile}
                  accept=".pdf,.doc,.docx"
                  maxSize={10}
                />
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
