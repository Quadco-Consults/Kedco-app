'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DocumentIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  ShieldCheckIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
  ClockIcon as ClockIconSolid,
} from '@heroicons/react/24/solid';

interface Signature {
  id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  requestedBy: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
  signers: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    status: 'pending' | 'viewed' | 'signed' | 'declined' | 'expired';
    signedDate?: string;
    ipAddress?: string;
    signatureMethod: 'digital' | 'drawn' | 'typed' | 'uploaded';
    signingOrder: number;
    isRequired: boolean;
    remindersSent: number;
    lastReminder?: string;
    declineReason?: string;
  }[];
  status: 'draft' | 'sent' | 'partially_signed' | 'completed' | 'declined' | 'expired' | 'cancelled';
  createdDate: string;
  sentDate?: string;
  completedDate?: string;
  expiryDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  message: string;
  requiresAllSignatures: boolean;
  sequentialSigning: boolean;
  allowDelegation: boolean;
  securityLevel: 'basic' | 'enhanced' | 'high';
  authenticationRequired: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'custom';
  templateId?: string;
  tags: string[];
  attachments: {
    name: string;
    size: string;
    type: string;
  }[];
  auditTrail: {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    details: string;
    ipAddress?: string;
  }[];
}

const mockSignatures: Signature[] = [
  {
    id: '1',
    documentId: 'doc-001',
    documentName: 'Employment Contract - John Doe',
    documentType: 'Contract',
    requestedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kedco.com',
      department: 'HR',
      role: 'HR Manager'
    },
    signers: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@kedco.com',
        role: 'Senior Developer',
        department: 'IT',
        status: 'signed',
        signedDate: '2025-01-14T10:30:00Z',
        ipAddress: '192.168.1.100',
        signatureMethod: 'drawn',
        signingOrder: 1,
        isRequired: true,
        remindersSent: 1,
        lastReminder: '2025-01-13T09:00:00Z'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@kedco.com',
        role: 'IT Director',
        department: 'IT',
        status: 'pending',
        signatureMethod: 'digital',
        signingOrder: 2,
        isRequired: true,
        remindersSent: 2,
        lastReminder: '2025-01-15T08:30:00Z'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@kedco.com',
        role: 'Legal Counsel',
        department: 'Legal',
        status: 'viewed',
        signatureMethod: 'digital',
        signingOrder: 3,
        isRequired: true,
        remindersSent: 0
      }
    ],
    status: 'partially_signed',
    createdDate: '2025-01-10T09:00:00Z',
    sentDate: '2025-01-10T14:30:00Z',
    expiryDate: '2025-01-25T23:59:59Z',
    priority: 'high',
    message: 'Please review and sign this employment contract for John Doe. All signatures are required before his start date.',
    requiresAllSignatures: true,
    sequentialSigning: true,
    allowDelegation: false,
    securityLevel: 'enhanced',
    authenticationRequired: true,
    reminderFrequency: 'daily',
    tags: ['employment', 'contract', 'hr'],
    attachments: [
      { name: 'Employment_Contract_JohnDoe.pdf', size: '2.1 MB', type: 'pdf' },
      { name: 'Benefits_Overview.pdf', size: '890 KB', type: 'pdf' }
    ],
    auditTrail: [
      {
        id: '1',
        timestamp: '2025-01-10T09:00:00Z',
        action: 'Document Created',
        user: 'Sarah Johnson',
        details: 'Employment contract created from template'
      },
      {
        id: '2',
        timestamp: '2025-01-10T14:30:00Z',
        action: 'Signature Request Sent',
        user: 'Sarah Johnson',
        details: 'Signature request sent to 3 signers'
      },
      {
        id: '3',
        timestamp: '2025-01-12T15:20:00Z',
        action: 'Document Viewed',
        user: 'Emily Rodriguez',
        details: 'Document opened and viewed',
        ipAddress: '192.168.1.105'
      },
      {
        id: '4',
        timestamp: '2025-01-14T10:30:00Z',
        action: 'Document Signed',
        user: 'John Doe',
        details: 'Document signed using drawn signature',
        ipAddress: '192.168.1.100'
      }
    ]
  },
  {
    id: '2',
    documentId: 'doc-002',
    documentName: 'Vendor Service Agreement - TechCorp',
    documentType: 'Service Agreement',
    requestedBy: {
      name: 'James Anderson',
      email: 'james.anderson@kedco.com',
      department: 'Procurement',
      role: 'Procurement Manager'
    },
    signers: [
      {
        id: '1',
        name: 'David Smith',
        email: 'david.smith@techcorp.com',
        role: 'Account Manager',
        department: 'Sales',
        status: 'signed',
        signedDate: '2025-01-13T16:45:00Z',
        ipAddress: '203.0.113.1',
        signatureMethod: 'digital',
        signingOrder: 1,
        isRequired: true,
        remindersSent: 0
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@kedco.com',
        role: 'Finance Director',
        department: 'Finance',
        status: 'signed',
        signedDate: '2025-01-14T11:20:00Z',
        ipAddress: '192.168.1.102',
        signatureMethod: 'digital',
        signingOrder: 2,
        isRequired: true,
        remindersSent: 1
      },
      {
        id: '3',
        name: 'Legal Team',
        email: 'legal@kedco.com',
        role: 'Legal Counsel',
        department: 'Legal',
        status: 'signed',
        signedDate: '2025-01-15T09:15:00Z',
        ipAddress: '192.168.1.103',
        signatureMethod: 'digital',
        signingOrder: 3,
        isRequired: true,
        remindersSent: 0
      }
    ],
    status: 'completed',
    createdDate: '2025-01-08T11:00:00Z',
    sentDate: '2025-01-08T15:30:00Z',
    completedDate: '2025-01-15T09:15:00Z',
    expiryDate: '2025-01-30T23:59:59Z',
    priority: 'medium',
    message: 'Service agreement with TechCorp for software licensing. Please review terms and sign.',
    requiresAllSignatures: true,
    sequentialSigning: false,
    allowDelegation: true,
    securityLevel: 'basic',
    authenticationRequired: false,
    reminderFrequency: 'weekly',
    tags: ['vendor', 'agreement', 'software'],
    attachments: [
      { name: 'TechCorp_Service_Agreement.pdf', size: '1.8 MB', type: 'pdf' }
    ],
    auditTrail: [
      {
        id: '1',
        timestamp: '2025-01-08T11:00:00Z',
        action: 'Document Created',
        user: 'James Anderson',
        details: 'Vendor agreement created'
      },
      {
        id: '2',
        timestamp: '2025-01-13T16:45:00Z',
        action: 'Document Signed',
        user: 'David Smith',
        details: 'Document signed by vendor representative'
      },
      {
        id: '3',
        timestamp: '2025-01-15T09:15:00Z',
        action: 'Signature Process Completed',
        user: 'System',
        details: 'All required signatures collected'
      }
    ]
  },
  {
    id: '3',
    documentId: 'doc-003',
    documentName: 'NDA - Project Alpha Partners',
    documentType: 'Non-Disclosure Agreement',
    requestedBy: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@kedco.com',
      department: 'Legal',
      role: 'Legal Counsel'
    },
    signers: [
      {
        id: '1',
        name: 'Robert Johnson',
        email: 'robert.johnson@partners.com',
        role: 'CEO',
        department: 'Executive',
        status: 'declined',
        signatureMethod: 'digital',
        signingOrder: 1,
        isRequired: true,
        remindersSent: 2,
        lastReminder: '2025-01-12T10:00:00Z',
        declineReason: 'Terms need to be renegotiated regarding data retention period'
      }
    ],
    status: 'declined',
    createdDate: '2025-01-05T14:00:00Z',
    sentDate: '2025-01-05T16:00:00Z',
    expiryDate: '2025-01-20T23:59:59Z',
    priority: 'urgent',
    message: 'Non-disclosure agreement for Project Alpha partnership. Urgent signature required.',
    requiresAllSignatures: true,
    sequentialSigning: false,
    allowDelegation: false,
    securityLevel: 'high',
    authenticationRequired: true,
    reminderFrequency: 'daily',
    tags: ['nda', 'project-alpha', 'partnership'],
    attachments: [
      { name: 'NDA_Project_Alpha.pdf', size: '756 KB', type: 'pdf' }
    ],
    auditTrail: [
      {
        id: '1',
        timestamp: '2025-01-05T14:00:00Z',
        action: 'Document Created',
        user: 'Emily Rodriguez',
        details: 'NDA created for Project Alpha'
      },
      {
        id: '2',
        timestamp: '2025-01-11T14:30:00Z',
        action: 'Document Declined',
        user: 'Robert Johnson',
        details: 'Signature declined - terms need renegotiation'
      }
    ]
  },
  {
    id: '4',
    documentId: 'doc-004',
    documentName: 'Board Resolution - Q4 Approval',
    documentType: 'Board Resolution',
    requestedBy: {
      name: 'Board Secretary',
      email: 'board.secretary@kedco.com',
      department: 'Executive',
      role: 'Secretary'
    },
    signers: [
      {
        id: '1',
        name: 'Chairman Smith',
        email: 'chairman@kedco.com',
        role: 'Chairman',
        department: 'Board',
        status: 'pending',
        signatureMethod: 'digital',
        signingOrder: 1,
        isRequired: true,
        remindersSent: 1,
        lastReminder: '2025-01-14T09:00:00Z'
      },
      {
        id: '2',
        name: 'Director Jones',
        email: 'director.jones@kedco.com',
        role: 'Board Director',
        department: 'Board',
        status: 'pending',
        signatureMethod: 'digital',
        signingOrder: 2,
        isRequired: true,
        remindersSent: 1,
        lastReminder: '2025-01-14T09:00:00Z'
      }
    ],
    status: 'sent',
    createdDate: '2025-01-12T08:00:00Z',
    sentDate: '2025-01-12T10:00:00Z',
    expiryDate: '2025-01-19T23:59:59Z',
    priority: 'urgent',
    message: 'Board resolution for Q4 financial approvals. Urgent signatures required before deadline.',
    requiresAllSignatures: true,
    sequentialSigning: true,
    allowDelegation: false,
    securityLevel: 'high',
    authenticationRequired: true,
    reminderFrequency: 'daily',
    tags: ['board', 'resolution', 'q4', 'urgent'],
    attachments: [
      { name: 'Board_Resolution_Q4.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    auditTrail: [
      {
        id: '1',
        timestamp: '2025-01-12T08:00:00Z',
        action: 'Document Created',
        user: 'Board Secretary',
        details: 'Board resolution created for Q4 approvals'
      },
      {
        id: '2',
        timestamp: '2025-01-12T10:00:00Z',
        action: 'Signature Request Sent',
        user: 'Board Secretary',
        details: 'Sent to board members for signature'
      }
    ]
  }
];

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-100 text-blue-700',
  partially_signed: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700'
};

const signerStatusColors = {
  pending: 'bg-gray-100 text-gray-700',
  viewed: 'bg-blue-100 text-blue-700',
  signed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  expired: 'bg-red-100 text-red-700'
};

const signerStatusIcons = {
  pending: ClockIcon,
  viewed: EyeIcon,
  signed: CheckCircleIcon,
  declined: XCircleIcon,
  expired: ExclamationTriangleIcon
};

const securityLevelColors = {
  basic: 'bg-green-100 text-green-700',
  enhanced: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDaysUntilExpiry(expiryDate: string) {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getCompletionPercentage(signers: Signature['signers']) {
  const requiredSigners = signers.filter(s => s.isRequired);
  const signedCount = requiredSigners.filter(s => s.status === 'signed').length;
  return Math.round((signedCount / requiredSigners.length) * 100);
}

export default function SignaturesPage() {
  const [signatures, setSignatures] = useState<Signature[]>(mockSignatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'partially_signed' | 'completed' | 'declined' | 'expired'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all');
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);

  const filteredSignatures = signatures.filter(signature => {
    const matchesSearch = !searchQuery ||
      signature.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signature.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      signature.signers.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      signature.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || signature.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || signature.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: signatures.length,
    pending: signatures.filter(s => s.status === 'sent' || s.status === 'partially_signed').length,
    completed: signatures.filter(s => s.status === 'completed').length,
    expired: signatures.filter(s => s.status === 'expired' || getDaysUntilExpiry(s.expiryDate) < 0).length,
    declined: signatures.filter(s => s.status === 'declined').length
  };

  const sendReminder = (signatureId: string, signerId: string) => {
    setSignatures(prev =>
      prev.map(signature => {
        if (signature.id === signatureId) {
          return {
            ...signature,
            signers: signature.signers.map(signer => {
              if (signer.id === signerId) {
                return {
                  ...signer,
                  remindersSent: signer.remindersSent + 1,
                  lastReminder: new Date().toISOString()
                };
              }
              return signer;
            })
          };
        }
        return signature;
      })
    );
  };

  const cancelSignature = (signatureId: string) => {
    setSignatures(prev =>
      prev.map(signature => {
        if (signature.id === signatureId) {
          return { ...signature, status: 'cancelled' as const };
        }
        return signature;
      })
    );
  };

  return (
    <DashboardLayout
      title="Digital Signatures"
      subtitle="Track and manage document signature workflows"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <PencilSquareIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
              <ClockIconSolid className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircleIconSolid className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.declined}</p>
              </div>
              <XCircleIconSolid className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.expired}</p>
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
                placeholder="Search signatures..."
                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partially_signed">Partially Signed</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Request Signature
          </button>
        </div>

        {/* Signatures List */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Signature Requests ({filteredSignatures.length})
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Track the status of all signature requests and workflows
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredSignatures.map((signature) => {
              const daysUntilExpiry = getDaysUntilExpiry(signature.expiryDate);
              const completionPercentage = getCompletionPercentage(signature.signers);

              return (
                <div key={signature.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900 cursor-pointer hover:text-green-600">
                          {signature.documentName}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[signature.status]}`}>
                          {signature.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[signature.priority]}`}>
                          {signature.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${securityLevelColors[signature.securityLevel]}`}>
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          {signature.securityLevel}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {signature.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          Requested by {signature.requestedBy.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {signature.sentDate ? `Sent ${formatDate(signature.sentDate)}` : `Created ${formatDate(signature.createdDate)}`}
                        </span>
                        <span className={`flex items-center gap-1 ${daysUntilExpiry <= 3 && daysUntilExpiry >= 0 ? 'text-orange-600' : daysUntilExpiry < 0 ? 'text-red-600' : ''}`}>
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          {daysUntilExpiry > 0
                            ? `Expires in ${daysUntilExpiry} days`
                            : daysUntilExpiry === 0
                            ? 'Expires today'
                            : `Expired ${Math.abs(daysUntilExpiry)} days ago`
                          }
                        </span>
                        <span className="flex items-center gap-1">
                          <DocumentIcon className="h-3 w-3" />
                          {signature.documentType}
                        </span>
                        {signature.authenticationRequired && (
                          <span className="flex items-center gap-1">
                            <FingerPrintIcon className="h-3 w-3" />
                            Auth Required
                          </span>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Signature Progress</span>
                          <span className="text-xs text-gray-600">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              completionPercentage === 100
                                ? 'bg-green-600'
                                : completionPercentage > 0
                                ? 'bg-blue-600'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Signers Status */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-900">Signers ({signature.signers.length})</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {signature.signers.map((signer) => {
                            const StatusIcon = signerStatusIcons[signer.status];
                            return (
                              <div key={signer.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{signer.name}</p>
                                    <p className="text-xs text-gray-500">{signer.role}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${signerStatusColors[signer.status]}`}>
                                    {signer.status}
                                  </span>
                                  {signer.status === 'pending' && (
                                    <button
                                      onClick={() => sendReminder(signature.id, signer.id)}
                                      className="text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      Remind
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tags */}
                      {signature.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {signature.tags.map((tag, index) => (
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

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedSignature(signature)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <ShareIcon className="h-4 w-4" />
                      </button>
                      {signature.status !== 'completed' && signature.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelSignature(signature.id)}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSignatures.length === 0 && (
            <div className="text-center py-12">
              <PencilSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No signature requests found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create a signature request to get started"
                }
              </p>
            </div>
          )}
        </div>

        {/* Signature Detail Modal */}
        {selectedSignature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedSignature.documentName}
                </h3>
                <button
                  onClick={() => setSelectedSignature(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Document Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Document Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedSignature.status]}`}>
                          {selectedSignature.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="text-gray-900">{selectedSignature.documentType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedSignature.priority]}`}>
                          {selectedSignature.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${securityLevelColors[selectedSignature.securityLevel]}`}>
                          {selectedSignature.securityLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sequential:</span>
                        <span className="text-gray-900">{selectedSignature.sequentialSigning ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{formatDate(selectedSignature.createdDate)}</span>
                      </div>
                      {selectedSignature.sentDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sent:</span>
                          <span className="text-gray-900">{formatDate(selectedSignature.sentDate)}</span>
                        </div>
                      )}
                      {selectedSignature.completedDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="text-gray-900">{formatDate(selectedSignature.completedDate)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expires:</span>
                        <span className={`${getDaysUntilExpiry(selectedSignature.expiryDate) <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(selectedSignature.expiryDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Trail */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Audit Trail</h4>
                  <div className="space-y-3">
                    {selectedSignature.auditTrail.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                        <div className="mt-1">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">{entry.action}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(entry.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>By: {entry.user}</span>
                            {entry.ipAddress && (
                              <span>IP: {entry.ipAddress}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}