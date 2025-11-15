'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/contexts/AuthContext';
import {
  DocumentIcon,
  FolderIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  isShared: boolean;
  collaborators: number;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    referenceNumber: 'DOC-2024-001',
    title: 'Project Proposal - Q1 Initiative',
    description: 'Detailed project proposal for the first quarter strategic initiative',
    status: 'DRAFT',
    priority: 'HIGH',
    createdAt: '2024-12-20T10:30:00Z',
    updatedAt: '2024-12-21T14:20:00Z',
    fileSize: 2048576, // 2MB
    mimeType: 'application/pdf',
    tags: ['project', 'proposal', 'q1'],
    isShared: true,
    collaborators: 3
  },
  {
    id: '2',
    referenceNumber: 'DOC-2024-002',
    title: 'Monthly Report - November',
    description: 'Comprehensive monthly performance report for November 2024',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    createdAt: '2024-12-15T09:15:00Z',
    updatedAt: '2024-12-20T11:45:00Z',
    fileSize: 1536000, // 1.5MB
    mimeType: 'application/pdf',
    tags: ['report', 'monthly', 'performance'],
    isShared: false,
    collaborators: 0
  },
  {
    id: '3',
    referenceNumber: 'DOC-2024-003',
    title: 'Budget Analysis Draft',
    description: 'Preliminary budget analysis for the upcoming fiscal year',
    status: 'DRAFT',
    priority: 'LOW',
    createdAt: '2024-12-10T16:00:00Z',
    updatedAt: '2024-12-18T10:30:00Z',
    fileSize: 3145728, // 3MB
    mimeType: 'application/vnd.ms-excel',
    tags: ['budget', 'analysis', 'finance'],
    isShared: true,
    collaborators: 2
  }
];

const folders = [
  { id: '1', name: 'Projects', count: 8, color: 'bg-blue-100 text-blue-600' },
  { id: '2', name: 'Reports', count: 15, color: 'bg-green-100 text-green-600' },
  { id: '3', name: 'Drafts', count: 5, color: 'bg-yellow-100 text-yellow-600' },
  { id: '4', name: 'Archive', count: 23, color: 'bg-gray-100 text-gray-600' },
];

const statusColors = {
  DRAFT: 'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-red-100 text-red-700',
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function MyDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || doc.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSelectDocument = (docId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDocuments(
      selectedDocuments.length === filteredDocuments.length
        ? []
        : filteredDocuments.map(doc => doc.id)
    );
  };

  return (
    <DashboardLayout
      title="My Documents"
      subtitle="Manage your personal documents and drafts"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
              </div>
              <DocumentIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(d => d.isShared).length}
                </p>
              </div>
              <ShareIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(d => d.status === 'UNDER_REVIEW').length}
                </p>
              </div>
              <EyeIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatFileSize(documents.reduce((acc, doc) => acc + doc.fileSize, 0))}
                </p>
              </div>
              <FolderIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Folders */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access Folders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map(folder => (
              <button
                key={folder.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 text-left transition-colors"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${folder.color}`}>
                  <FolderIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{folder.name}</p>
                  <p className="text-sm text-gray-600">{folder.count} documents</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search my documents..."
                className="w-80 rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="all">All Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              <PlusIcon className="h-4 w-4" />
              New Document
            </button>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDocuments.length > 0 && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100">
                  <ShareIcon className="h-4 w-4" />
                  Share
                </button>
                <button className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-blue-800 hover:bg-blue-100">
                  <DocumentDuplicateIcon className="h-4 w-4" />
                  Copy
                </button>
                <button className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-100">
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {filteredDocuments.length} of {documents.length} documents
                </p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-600">Select all</span>
              </label>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredDocuments.map(document => (
                <div
                  key={document.id}
                  className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                    selectedDocuments.includes(document.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <DocumentIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <span className="text-xs text-gray-500">{document.referenceNumber}</span>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{document.title}</h4>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={() => handleSelectDocument(document.id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {document.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[document.status as keyof typeof statusColors]}`}>
                      {document.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[document.priority as keyof typeof priorityColors]}`}>
                      {document.priority}
                    </span>
                    {document.isShared && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        <ShareIcon className="h-3 w-3 mr-1" />
                        +{document.collaborators}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {document.tags.map(tag => (
                      <span key={tag} className="inline-flex px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(document.fileSize)}</span>
                    <span>{formatDate(document.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
                      <EyeIcon className="h-4 w-4" />
                      View
                    </button>
                    <button className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200">
                      <ShareIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map(document => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(document.id)}
                          onChange={() => handleSelectDocument(document.id)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DocumentIcon className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{document.title}</div>
                            <div className="text-sm text-gray-500">{document.referenceNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[document.status as keyof typeof statusColors]}`}>
                          {document.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${priorityColors[document.priority as keyof typeof priorityColors]}`}>
                          {document.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(document.fileSize)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(document.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}