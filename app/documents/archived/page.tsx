'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DocumentIcon,
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  ClockIcon,
  TrashIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUturnLeftIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  EyeIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface ArchivedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  originalLocation: string;
  archivedBy: {
    name: string;
    email: string;
  };
  archivedDate: string;
  reason: 'manual' | 'retention_policy' | 'expired' | 'duplicate' | 'compliance';
  retentionUntil?: string;
  canRestore: boolean;
  canPermanentDelete: boolean;
  lastModified: string;
  originalOwner: string;
  tags?: string[];
  department: string;
  accessLevel: 'public' | 'internal' | 'restricted' | 'confidential';
  fileVersion: string;
}

const mockArchivedDocuments: ArchivedDocument[] = [
  {
    id: '1',
    name: 'Q3 Financial Report 2024.pdf',
    type: 'pdf',
    size: '2.8 MB',
    originalLocation: '/Finance/Quarterly Reports',
    archivedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kedco.com'
    },
    archivedDate: '2025-01-10T09:30:00Z',
    reason: 'retention_policy',
    retentionUntil: '2032-01-10T23:59:59Z',
    canRestore: true,
    canPermanentDelete: false,
    lastModified: '2024-10-15T14:22:00Z',
    originalOwner: 'Finance Department',
    tags: ['Q3', 'finance', 'quarterly'],
    department: 'Finance',
    accessLevel: 'internal',
    fileVersion: '3.2'
  },
  {
    id: '2',
    name: 'Old Employee Handbook 2023.docx',
    type: 'docx',
    size: '1.2 MB',
    originalLocation: '/HR/Policies',
    archivedBy: {
      name: 'James Anderson',
      email: 'james.anderson@kedco.com'
    },
    archivedDate: '2025-01-05T16:45:00Z',
    reason: 'manual',
    canRestore: true,
    canPermanentDelete: true,
    lastModified: '2023-12-31T23:59:00Z',
    originalOwner: 'HR Department',
    tags: ['handbook', 'policies', 'outdated'],
    department: 'Human Resources',
    accessLevel: 'public',
    fileVersion: '2.1'
  },
  {
    id: '3',
    name: 'Project Beta - Requirements (DUPLICATE).xlsx',
    type: 'xlsx',
    size: '456 KB',
    originalLocation: '/Projects/Project Beta',
    archivedBy: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@kedco.com'
    },
    archivedDate: '2025-01-08T11:20:00Z',
    reason: 'duplicate',
    canRestore: false,
    canPermanentDelete: true,
    lastModified: '2024-11-22T10:15:00Z',
    originalOwner: 'Project Management',
    tags: ['project', 'requirements', 'duplicate'],
    department: 'Operations',
    accessLevel: 'internal',
    fileVersion: '1.0'
  },
  {
    id: '4',
    name: 'Expired Contract - Vendor XYZ.pdf',
    type: 'pdf',
    size: '892 KB',
    originalLocation: '/Legal/Contracts/Expired',
    archivedBy: {
      name: 'System',
      email: 'system@kedco.com'
    },
    archivedDate: '2025-01-01T00:00:00Z',
    reason: 'expired',
    retentionUntil: '2030-01-01T23:59:59Z',
    canRestore: true,
    canPermanentDelete: false,
    lastModified: '2024-12-31T23:59:00Z',
    originalOwner: 'Legal Department',
    tags: ['contract', 'vendor', 'expired'],
    department: 'Legal',
    accessLevel: 'restricted',
    fileVersion: '4.0'
  },
  {
    id: '5',
    name: 'Safety Incident Report 2023-456.pdf',
    type: 'pdf',
    size: '234 KB',
    originalLocation: '/Safety/Incident Reports/2023',
    archivedBy: {
      name: 'David Wilson',
      email: 'david.wilson@kedco.com'
    },
    archivedDate: '2025-01-03T14:30:00Z',
    reason: 'compliance',
    retentionUntil: '2030-01-03T23:59:59Z',
    canRestore: false,
    canPermanentDelete: false,
    lastModified: '2023-06-15T08:45:00Z',
    originalOwner: 'Safety Department',
    tags: ['incident', 'safety', 'report', 'archived'],
    department: 'Safety & Compliance',
    accessLevel: 'confidential',
    fileVersion: '1.3'
  },
  {
    id: '6',
    name: 'Marketing Campaign Data 2022.xlsx',
    type: 'xlsx',
    size: '3.4 MB',
    originalLocation: '/Marketing/Campaigns/2022',
    archivedBy: {
      name: 'Marketing Team',
      email: 'marketing@kedco.com'
    },
    archivedDate: '2024-12-20T10:00:00Z',
    reason: 'retention_policy',
    retentionUntil: '2027-12-20T23:59:59Z',
    canRestore: true,
    canPermanentDelete: false,
    lastModified: '2022-12-31T17:30:00Z',
    originalOwner: 'Marketing Department',
    tags: ['campaign', 'data', 'marketing', '2022'],
    department: 'Marketing',
    accessLevel: 'internal',
    fileVersion: '2.5'
  }
];

const reasonLabels = {
  manual: 'Manually Archived',
  retention_policy: 'Retention Policy',
  expired: 'Document Expired',
  duplicate: 'Duplicate File',
  compliance: 'Compliance Archive'
};

const reasonColors = {
  manual: 'bg-blue-100 text-blue-700',
  retention_policy: 'bg-purple-100 text-purple-700',
  expired: 'bg-red-100 text-red-700',
  duplicate: 'bg-yellow-100 text-yellow-700',
  compliance: 'bg-green-100 text-green-700'
};

const accessLevelColors = {
  public: 'bg-green-100 text-green-700',
  internal: 'bg-blue-100 text-blue-700',
  restricted: 'bg-orange-100 text-orange-700',
  confidential: 'bg-red-100 text-red-700'
};

const typeIcons: { [key: string]: any } = {
  pdf: DocumentIcon,
  docx: DocumentIcon,
  xlsx: DocumentIcon,
  pptx: DocumentIcon,
};

function formatFileSize(size: string) {
  return size;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function calculateRetentionDays(retentionUntil: string | undefined) {
  if (!retentionUntil) return null;
  const retention = new Date(retentionUntil);
  const now = new Date();
  const diffDays = Math.ceil((retention.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function ArchivedDocumentsPage() {
  const [documents, setDocuments] = useState<ArchivedDocument[]>(mockArchivedDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState<'all' | 'manual' | 'retention_policy' | 'expired' | 'duplicate' | 'compliance'>('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processingDocuments, setProcessingDocuments] = useState<string[]>([]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.originalOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesReason = filterReason === 'all' || doc.reason === filterReason;
    const matchesDepartment = filterDepartment === 'all' || doc.department === filterDepartment;

    return matchesSearch && matchesReason && matchesDepartment;
  });

  const departments = Array.from(new Set(documents.map(doc => doc.department)));

  const restoreDocument = async (docId: string) => {
    setProcessingDocuments(prev => [...prev, docId]);

    // Simulate API call
    setTimeout(() => {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
      setProcessingDocuments(prev => prev.filter(id => id !== docId));
    }, 2000);
  };

  const permanentDeleteDocument = async (docId: string) => {
    setProcessingDocuments(prev => [...prev, docId]);

    // Simulate API call
    setTimeout(() => {
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
      setProcessingDocuments(prev => prev.filter(id => id !== docId));
    }, 2000);
  };

  const bulkRestore = async () => {
    const restorableDocuments = selectedDocuments.filter(id => {
      const doc = documents.find(d => d.id === id);
      return doc?.canRestore;
    });

    setProcessingDocuments(prev => [...prev, ...restorableDocuments]);

    // Simulate API call
    setTimeout(() => {
      setDocuments(prev => prev.filter(doc => !restorableDocuments.includes(doc.id)));
      setSelectedDocuments([]);
      setProcessingDocuments(prev => prev.filter(id => !restorableDocuments.includes(id)));
      setShowRestoreModal(false);
    }, 3000);
  };

  const bulkDelete = async () => {
    const deletableDocuments = selectedDocuments.filter(id => {
      const doc = documents.find(d => d.id === id);
      return doc?.canPermanentDelete;
    });

    setProcessingDocuments(prev => [...prev, ...deletableDocuments]);

    // Simulate API call
    setTimeout(() => {
      setDocuments(prev => prev.filter(doc => !deletableDocuments.includes(doc.id)));
      setSelectedDocuments([]);
      setProcessingDocuments(prev => prev.filter(id => !deletableDocuments.includes(id)));
      setShowDeleteModal(false);
    }, 3000);
  };

  const retentionStats = {
    totalArchived: documents.length,
    canRestore: documents.filter(d => d.canRestore).length,
    canDelete: documents.filter(d => d.canPermanentDelete).length,
    expiringRetention: documents.filter(d => {
      if (!d.retentionUntil) return false;
      const days = calculateRetentionDays(d.retentionUntil);
      return days !== null && days <= 30 && days > 0;
    }).length
  };

  return (
    <DashboardLayout
      title="Archived Documents"
      subtitle="Manage archived documents and retention policies"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Archived</p>
                <p className="text-2xl font-semibold text-gray-900">{retentionStats.totalArchived}</p>
              </div>
              <ArchiveBoxIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Can Restore</p>
                <p className="text-2xl font-semibold text-gray-900">{retentionStats.canRestore}</p>
              </div>
              <ArrowUturnLeftIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Can Delete</p>
                <p className="text-2xl font-semibold text-gray-900">{retentionStats.canDelete}</p>
              </div>
              <TrashIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retention Expiring</p>
                <p className="text-2xl font-semibold text-gray-900">{retentionStats.expiringRetention}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archived documents..."
                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Reasons</option>
              <option value="manual">Manual</option>
              <option value="retention_policy">Retention Policy</option>
              <option value="expired">Expired</option>
              <option value="duplicate">Duplicate</option>
              <option value="compliance">Compliance</option>
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-gray-300 p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
            </div>

            {selectedDocuments.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRestoreModal(true)}
                  disabled={selectedDocuments.filter(id => documents.find(d => d.id === id)?.canRestore).length === 0}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ArrowUturnLeftIcon className="h-4 w-4" />
                  Restore ({selectedDocuments.filter(id => documents.find(d => d.id === id)?.canRestore).length})
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={selectedDocuments.filter(id => documents.find(d => d.id === id)?.canPermanentDelete).length === 0}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete ({selectedDocuments.filter(id => documents.find(d => d.id === id)?.canPermanentDelete).length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Documents List/Grid */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Archived Documents ({filteredDocuments.length})
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Documents in the archive with retention policies
                </p>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.length} selected
                  </span>
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocuments(filteredDocuments.map(d => d.id));
                      } else {
                        setSelectedDocuments([]);
                      }
                    }}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              )}
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const IconComponent = typeIcons[doc.type] || DocumentIcon;
                const retentionDays = calculateRetentionDays(doc.retentionUntil);
                const isProcessing = processingDocuments.includes(doc.id);

                return (
                  <div key={doc.id} className={`p-6 hover:bg-gray-50 transition-colors ${isProcessing ? 'opacity-50' : ''}`}>
                    <div className="flex items-start gap-4">
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
                        disabled={isProcessing}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                      />

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-100">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reasonColors[doc.reason]}`}>
                            {reasonLabels[doc.reason]}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${accessLevelColors[doc.accessLevel]}`}>
                            {doc.accessLevel}
                          </span>
                          {isProcessing && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                              Processing...
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          Original location: {doc.originalLocation}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            Archived by {doc.archivedBy.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {formatDate(doc.archivedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FolderIcon className="h-3 w-3" />
                            {doc.department}
                          </span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>v{doc.fileVersion}</span>
                          {retentionDays !== null && (
                            <span className={`flex items-center gap-1 ${retentionDays <= 30 ? 'text-orange-600' : 'text-gray-500'}`}>
                              <CalendarIcon className="h-3 w-3" />
                              {retentionDays > 0 ? `${retentionDays} days until deletion` : 'Retention expired'}
                            </span>
                          )}
                        </div>

                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {doc.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {doc.canRestore && (
                          <button
                            onClick={() => restoreDocument(doc.id)}
                            disabled={isProcessing}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                            Restore
                          </button>
                        )}
                        {doc.canPermanentDelete && (
                          <button
                            onClick={() => permanentDeleteDocument(doc.id)}
                            disabled={isProcessing}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredDocuments.map((doc) => {
                const IconComponent = typeIcons[doc.type] || DocumentIcon;
                const retentionDays = calculateRetentionDays(doc.retentionUntil);
                const isProcessing = processingDocuments.includes(doc.id);

                return (
                  <div key={doc.id} className={`rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${isProcessing ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-100">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
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
                        disabled={isProcessing}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mb-2 truncate">
                      {doc.name}
                    </h4>

                    <div className="space-y-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reasonColors[doc.reason]}`}>
                        {reasonLabels[doc.reason]}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${accessLevelColors[doc.accessLevel]} ml-2`}>
                        {doc.accessLevel}
                      </span>
                      {isProcessing && (
                        <div className="w-full">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Processing...
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <FolderIcon className="h-3 w-3" />
                        <span className="truncate">{doc.originalLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {doc.archivedBy.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatDate(doc.archivedDate)}
                      </div>
                      {retentionDays !== null && (
                        <div className={`flex items-center gap-1 ${retentionDays <= 30 ? 'text-orange-600' : 'text-gray-500'}`}>
                          <CalendarIcon className="h-3 w-3" />
                          <span className="truncate">
                            {retentionDays > 0 ? `${retentionDays}d until deletion` : 'Retention expired'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {doc.canRestore && (
                          <button
                            onClick={() => restoreDocument(doc.id)}
                            disabled={isProcessing}
                            className="p-1.5 text-green-600 hover:text-green-700 disabled:opacity-50"
                            title="Restore document"
                          >
                            <ArrowUturnLeftIcon className="h-4 w-4" />
                          </button>
                        )}
                        {doc.canPermanentDelete && (
                          <button
                            onClick={() => permanentDeleteDocument(doc.id)}
                            disabled={isProcessing}
                            className="p-1.5 text-red-600 hover:text-red-700 disabled:opacity-50"
                            title="Permanently delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-12">
              <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No archived documents found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Archived documents will appear here"
                }
              </p>
            </div>
          )}
        </div>

        {/* Restore Modal */}
        {showRestoreModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Restore Documents</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to restore {selectedDocuments.filter(id => documents.find(d => d.id === id)?.canRestore).length} documents?
                They will be restored to their original locations.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={bulkRestore}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Restore Documents
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Permanently Delete Documents</h3>
              <div className="flex items-center gap-3 mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                <p className="text-gray-600">
                  This action cannot be undone. {selectedDocuments.filter(id => documents.find(d => d.id === id)?.canPermanentDelete).length} documents will be permanently deleted.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={bulkDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}