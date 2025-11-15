'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DocumentIcon,
  ShareIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  ClockIcon,
  FolderIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  UserPlusIcon,
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

interface SharedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  sharedBy: {
    name: string;
    email: string;
    avatar?: string;
  };
  sharedWith: {
    name: string;
    email: string;
    permission: 'view' | 'edit' | 'admin';
  }[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canShare: boolean;
    canDelete: boolean;
  };
  sharedDate: string;
  lastAccessed: string;
  accessCount: number;
  folder?: string;
  tags?: string[];
  status: 'active' | 'expired' | 'pending';
  expiresAt?: string;
  description?: string;
  isPublicLink: boolean;
  comments: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

const mockSharedDocuments: SharedDocument[] = [
  {
    id: '1',
    name: 'Q4 Financial Report 2024.pdf',
    type: 'pdf',
    size: '3.2 MB',
    sharedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kedco.com'
    },
    sharedWith: [
      { name: 'Michael Chen', email: 'michael.chen@kedco.com', permission: 'edit' },
      { name: 'Emily Rodriguez', email: 'emily.rodriguez@kedco.com', permission: 'view' },
      { name: 'Finance Team', email: 'finance@kedco.com', permission: 'view' }
    ],
    permissions: {
      canView: true,
      canEdit: true,
      canShare: true,
      canDelete: false
    },
    sharedDate: '2025-01-10T09:30:00Z',
    lastAccessed: '2025-01-15T14:22:00Z',
    accessCount: 47,
    folder: 'Financial Reports',
    tags: ['Q4', 'finance', 'confidential'],
    status: 'active',
    expiresAt: '2025-02-15T23:59:59Z',
    description: 'Quarterly financial analysis and budget projections for Q4 2024',
    isPublicLink: false,
    comments: [
      {
        id: '1',
        author: 'Michael Chen',
        text: 'The revenue projections look optimistic. Can we review the Q1 forecasts?',
        timestamp: '2025-01-14T10:15:00Z'
      },
      {
        id: '2',
        author: 'Emily Rodriguez',
        text: 'Approved for distribution to board members.',
        timestamp: '2025-01-15T08:30:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Project Alpha - Technical Specifications',
    type: 'docx',
    size: '1.8 MB',
    sharedBy: {
      name: 'David Wilson',
      email: 'david.wilson@kedco.com'
    },
    sharedWith: [
      { name: 'Development Team', email: 'dev-team@kedco.com', permission: 'edit' },
      { name: 'James Anderson', email: 'james.anderson@kedco.com', permission: 'admin' },
      { name: 'Product Team', email: 'product@kedco.com', permission: 'view' }
    ],
    permissions: {
      canView: true,
      canEdit: true,
      canShare: false,
      canDelete: false
    },
    sharedDate: '2025-01-08T15:45:00Z',
    lastAccessed: '2025-01-15T11:30:00Z',
    accessCount: 23,
    folder: 'Project Alpha',
    tags: ['technical', 'specifications', 'development'],
    status: 'active',
    description: 'Detailed technical requirements and implementation guidelines',
    isPublicLink: true,
    comments: [
      {
        id: '1',
        author: 'James Anderson',
        text: 'Great work on the API specifications section.',
        timestamp: '2025-01-12T14:20:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'Safety Guidelines Handbook.pdf',
    type: 'pdf',
    size: '4.1 MB',
    sharedBy: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@kedco.com'
    },
    sharedWith: [
      { name: 'All Staff', email: 'all-staff@kedco.com', permission: 'view' },
      { name: 'Safety Officers', email: 'safety@kedco.com', permission: 'edit' }
    ],
    permissions: {
      canView: true,
      canEdit: false,
      canShare: false,
      canDelete: false
    },
    sharedDate: '2025-01-05T08:00:00Z',
    lastAccessed: '2025-01-14T16:45:00Z',
    accessCount: 156,
    folder: 'Safety & Compliance',
    tags: ['safety', 'handbook', 'compliance', 'mandatory'],
    status: 'active',
    description: 'Comprehensive safety guidelines for all employees',
    isPublicLink: true,
    comments: []
  },
  {
    id: '4',
    name: 'Contract - Vendor Agreement 2024.docx',
    type: 'docx',
    size: '892 KB',
    sharedBy: {
      name: 'Michael Chen',
      email: 'michael.chen@kedco.com'
    },
    sharedWith: [
      { name: 'Legal Team', email: 'legal@kedco.com', permission: 'edit' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@kedco.com', permission: 'view' }
    ],
    permissions: {
      canView: true,
      canEdit: false,
      canShare: false,
      canDelete: false
    },
    sharedDate: '2025-01-12T13:20:00Z',
    lastAccessed: '2025-01-15T09:15:00Z',
    accessCount: 8,
    folder: 'Legal Documents',
    tags: ['contract', 'vendor', 'legal'],
    status: 'pending',
    expiresAt: '2025-01-20T23:59:59Z',
    description: 'Vendor service agreement requiring legal review',
    isPublicLink: false,
    comments: [
      {
        id: '1',
        author: 'Legal Team',
        text: 'Reviewing terms and conditions. Will provide feedback by EOD.',
        timestamp: '2025-01-14T11:00:00Z'
      }
    ]
  },
  {
    id: '5',
    name: 'Training Materials - Q1 2025.pptx',
    type: 'pptx',
    size: '12.3 MB',
    sharedBy: {
      name: 'James Anderson',
      email: 'james.anderson@kedco.com'
    },
    sharedWith: [
      { name: 'HR Team', email: 'hr@kedco.com', permission: 'admin' },
      { name: 'Department Heads', email: 'dept-heads@kedco.com', permission: 'view' }
    ],
    permissions: {
      canView: true,
      canEdit: true,
      canShare: true,
      canDelete: true
    },
    sharedDate: '2025-01-01T10:00:00Z',
    lastAccessed: '2025-01-13T15:30:00Z',
    accessCount: 34,
    folder: 'Training',
    tags: ['training', 'Q1', 'onboarding'],
    status: 'expired',
    expiresAt: '2025-01-15T00:00:00Z',
    description: 'Employee training and onboarding materials for Q1',
    isPublicLink: false,
    comments: []
  }
];

const permissionColors = {
  view: 'bg-blue-100 text-blue-700',
  edit: 'bg-green-100 text-green-700',
  admin: 'bg-purple-100 text-purple-700',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const statusIcons = {
  active: CheckCircleIcon,
  expired: XCircleIcon,
  pending: ExclamationTriangleIcon,
};

const typeIcons: { [key: string]: any } = {
  pdf: DocumentIcon,
  docx: DocumentIcon,
  pptx: DocumentIcon,
  xlsx: DocumentIcon,
};

function formatFileSize(size: string) {
  return size;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return date.toLocaleDateString();
}

function isExpiringSoon(expiresAt: string | undefined) {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7 && diffDays > 0;
}

export default function SharedDocumentsPage() {
  const [documents, setDocuments] = useState<SharedDocument[]>(mockSharedDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');
  const [filterPermission, setFilterPermission] = useState<'all' | 'view' | 'edit' | 'admin'>('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SharedDocument | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;

    const matchesPermission = filterPermission === 'all' ||
      doc.permissions.canEdit && filterPermission === 'edit' ||
      doc.permissions.canView && filterPermission === 'view';

    return matchesSearch && matchesStatus && matchesPermission;
  });

  const sharedWithMeCount = documents.filter(doc =>
    doc.sharedBy.email !== 'current-user@kedco.com'
  ).length;

  const sharedByMeCount = documents.filter(doc =>
    doc.sharedBy.email === 'current-user@kedco.com'
  ).length;

  const revokeAccess = (docId: string, userEmail: string) => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            sharedWith: doc.sharedWith.filter(user => user.email !== userEmail)
          };
        }
        return doc;
      })
    );
  };

  const changePermission = (docId: string, userEmail: string, newPermission: 'view' | 'edit' | 'admin') => {
    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === docId) {
          return {
            ...doc,
            sharedWith: doc.sharedWith.map(user =>
              user.email === userEmail ? { ...user, permission: newPermission } : user
            )
          };
        }
        return doc;
      })
    );
  };

  const getExpiryStatus = (doc: SharedDocument) => {
    if (!doc.expiresAt) return null;

    const expiry = new Date(doc.expiresAt);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', color: 'text-red-600' };
    if (diffDays <= 7) return { text: `Expires in ${diffDays} days`, color: 'text-orange-600' };
    return { text: `Expires ${expiry.toLocaleDateString()}`, color: 'text-gray-600' };
  };

  return (
    <DashboardLayout
      title="Shared Documents"
      subtitle="Manage documents shared with you and by you"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared with Me</p>
                <p className="text-2xl font-semibold text-gray-900">{sharedWithMeCount}</p>
              </div>
              <ShareIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared by Me</p>
                <p className="text-2xl font-semibold text-gray-900">{sharedByMeCount}</p>
              </div>
              <UserIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Shares</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(d => d.status === 'active').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documents.filter(d => d.expiresAt && isExpiringSoon(d.expiresAt)).length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-orange-600" />
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
                placeholder="Search shared documents..."
                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={filterPermission}
              onChange={(e) => setFilterPermission(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Permissions</option>
              <option value="view">View Only</option>
              <option value="edit">Can Edit</option>
              <option value="admin">Admin</option>
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
            <button
              onClick={() => setShowShareModal(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <UserPlusIcon className="h-4 w-4" />
              Share Document
            </button>
          </div>
        </div>

        {/* Documents List/Grid */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Shared Documents ({filteredDocuments.length})
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Documents shared with you and by you
                </p>
              </div>
              {selectedDocuments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.length} selected
                  </span>
                  <button className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                    Revoke Access
                  </button>
                </div>
              )}
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => {
                const IconComponent = typeIcons[doc.type] || DocumentIcon;
                const StatusIcon = statusIcons[doc.status];
                const expiryStatus = getExpiryStatus(doc);

                return (
                  <div key={doc.id} className="p-6 hover:bg-gray-50">
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
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                      />

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 bg-blue-100">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 cursor-pointer hover:text-green-600">
                            {doc.name}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {doc.status}
                          </span>
                          {doc.isPublicLink && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                              <LinkIcon className="h-3 w-3 mr-1" />
                              Public Link
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {doc.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-3 w-3" />
                            Shared by {doc.sharedBy.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {formatDate(doc.sharedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            {doc.accessCount} views
                          </span>
                          <span>{formatFileSize(doc.size)}</span>
                          {expiryStatus && (
                            <span className={`${expiryStatus.color} flex items-center gap-1`}>
                              <CalendarIcon className="h-3 w-3" />
                              {expiryStatus.text}
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

                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Shared with:</span>
                            <div className="flex items-center gap-1">
                              {doc.sharedWith.slice(0, 3).map((user, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${permissionColors[user.permission]}`}>
                                    {user.name} ({user.permission})
                                  </span>
                                </div>
                              ))}
                              {doc.sharedWith.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{doc.sharedWith.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDocument(doc)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {doc.permissions.canEdit && (
                          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {doc.permissions.canShare && (
                          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                            <ShareIcon className="h-4 w-4" />
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
                const StatusIcon = statusIcons[doc.status];
                const expiryStatus = getExpiryStatus(doc);

                return (
                  <div key={doc.id} className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mb-2 cursor-pointer hover:text-green-600">
                      {doc.name}
                    </h4>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[doc.status]}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {doc.status}
                      </span>
                      {doc.isPublicLink && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                          <LinkIcon className="h-3 w-3 mr-1" />
                          Public
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {doc.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {doc.sharedBy.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatDate(doc.sharedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        {doc.accessCount} views
                      </div>
                      {expiryStatus && (
                        <div className={`flex items-center gap-1 ${expiryStatus.color}`}>
                          <CalendarIcon className="h-3 w-3" />
                          {expiryStatus.text}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-500">{formatFileSize(doc.size)}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {doc.permissions.canEdit && (
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {doc.permissions.canShare && (
                          <button className="p-1.5 text-gray-400 hover:text-gray-600">
                            <ShareIcon className="h-4 w-4" />
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
              <ShareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No shared documents found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Documents shared with you or by you will appear here"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}