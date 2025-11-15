'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  DocumentIcon,
  EyeIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  StarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
} from '@heroicons/react/24/solid';

interface Review {
  id: string;
  documentId: string;
  documentName: string;
  documentType: string;
  requester: {
    name: string;
    email: string;
    department: string;
    role: string;
  };
  assignedReviewers: {
    name: string;
    email: string;
    status: 'pending' | 'in_progress' | 'completed' | 'declined';
    priority: number;
    assignedDate: string;
    completedDate?: string;
    comments?: string;
    rating?: number;
  }[];
  reviewType: 'legal' | 'technical' | 'financial' | 'compliance' | 'quality' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: string;
  status: 'draft' | 'active' | 'completed' | 'overdue' | 'cancelled';
  createdDate: string;
  lastUpdated: string;
  description: string;
  reviewCriteria: string[];
  isUrgent: boolean;
  approvalThreshold: number; // Minimum number of approvals needed
  currentApprovals: number;
  version: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  reviewHistory: {
    id: string;
    reviewer: string;
    action: 'assigned' | 'started' | 'commented' | 'approved' | 'rejected' | 'completed';
    timestamp: string;
    comment?: string;
    rating?: number;
  }[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    documentId: 'doc-001',
    documentName: 'Annual Financial Statement 2024',
    documentType: 'Financial Report',
    requester: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kedco.com',
      department: 'Finance',
      role: 'Finance Director'
    },
    assignedReviewers: [
      {
        name: 'Michael Chen',
        email: 'michael.chen@kedco.com',
        status: 'completed',
        priority: 1,
        assignedDate: '2025-01-10T09:00:00Z',
        completedDate: '2025-01-12T14:30:00Z',
        comments: 'All financial calculations verified. Recommend approval.',
        rating: 5
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@kedco.com',
        status: 'in_progress',
        priority: 2,
        assignedDate: '2025-01-10T09:00:00Z',
        comments: 'Currently reviewing compliance sections.'
      },
      {
        name: 'Legal Team',
        email: 'legal@kedco.com',
        status: 'pending',
        priority: 3,
        assignedDate: '2025-01-10T09:00:00Z'
      }
    ],
    reviewType: 'financial',
    priority: 'high',
    deadline: '2025-01-20T23:59:59Z',
    status: 'active',
    createdDate: '2025-01-10T08:30:00Z',
    lastUpdated: '2025-01-15T11:20:00Z',
    description: 'Comprehensive review of annual financial statements for board presentation and regulatory compliance.',
    reviewCriteria: ['Financial accuracy', 'Regulatory compliance', 'Data validation', 'Legal review'],
    isUrgent: true,
    approvalThreshold: 2,
    currentApprovals: 1,
    version: '2.1',
    attachments: [
      { name: 'Financial_Statement_2024.pdf', size: '3.2 MB', type: 'pdf' },
      { name: 'Supporting_Documents.xlsx', size: '1.8 MB', type: 'excel' }
    ],
    reviewHistory: [
      {
        id: '1',
        reviewer: 'System',
        action: 'assigned',
        timestamp: '2025-01-10T09:00:00Z',
        comment: 'Review workflow initiated'
      },
      {
        id: '2',
        reviewer: 'Michael Chen',
        action: 'started',
        timestamp: '2025-01-11T10:15:00Z',
        comment: 'Beginning financial review'
      },
      {
        id: '3',
        reviewer: 'Michael Chen',
        action: 'approved',
        timestamp: '2025-01-12T14:30:00Z',
        comment: 'All financial calculations verified. Recommend approval.',
        rating: 5
      }
    ]
  },
  {
    id: '2',
    documentId: 'doc-002',
    documentName: 'Software Security Policy Update',
    documentType: 'Policy Document',
    requester: {
      name: 'David Wilson',
      email: 'david.wilson@kedco.com',
      department: 'IT Security',
      role: 'Security Officer'
    },
    assignedReviewers: [
      {
        name: 'IT Team',
        email: 'it@kedco.com',
        status: 'completed',
        priority: 1,
        assignedDate: '2025-01-08T14:00:00Z',
        completedDate: '2025-01-10T16:45:00Z',
        comments: 'Technical implementation is feasible. Approved.',
        rating: 4
      },
      {
        name: 'Legal Department',
        email: 'legal@kedco.com',
        status: 'completed',
        priority: 2,
        assignedDate: '2025-01-08T14:00:00Z',
        completedDate: '2025-01-11T09:20:00Z',
        comments: 'Policy complies with regulatory requirements.',
        rating: 5
      },
      {
        name: 'HR Team',
        email: 'hr@kedco.com',
        status: 'completed',
        priority: 3,
        assignedDate: '2025-01-08T14:00:00Z',
        completedDate: '2025-01-12T11:00:00Z',
        comments: 'Training requirements clearly defined.',
        rating: 4
      }
    ],
    reviewType: 'security',
    priority: 'medium',
    deadline: '2025-01-25T23:59:59Z',
    status: 'completed',
    createdDate: '2025-01-08T13:30:00Z',
    lastUpdated: '2025-01-12T11:00:00Z',
    description: 'Review of updated software security policy for implementation across all departments.',
    reviewCriteria: ['Technical feasibility', 'Legal compliance', 'Implementation impact', 'Training requirements'],
    isUrgent: false,
    approvalThreshold: 3,
    currentApprovals: 3,
    version: '1.3',
    reviewHistory: [
      {
        id: '1',
        reviewer: 'System',
        action: 'assigned',
        timestamp: '2025-01-08T14:00:00Z'
      },
      {
        id: '2',
        reviewer: 'IT Team',
        action: 'approved',
        timestamp: '2025-01-10T16:45:00Z',
        rating: 4
      },
      {
        id: '3',
        reviewer: 'Legal Department',
        action: 'approved',
        timestamp: '2025-01-11T09:20:00Z',
        rating: 5
      },
      {
        id: '4',
        reviewer: 'HR Team',
        action: 'completed',
        timestamp: '2025-01-12T11:00:00Z',
        rating: 4
      }
    ]
  },
  {
    id: '3',
    documentId: 'doc-003',
    documentName: 'Vendor Contract Agreement - TechCorp',
    documentType: 'Legal Contract',
    requester: {
      name: 'James Anderson',
      email: 'james.anderson@kedco.com',
      department: 'Procurement',
      role: 'Procurement Manager'
    },
    assignedReviewers: [
      {
        name: 'Legal Counsel',
        email: 'legal.counsel@kedco.com',
        status: 'in_progress',
        priority: 1,
        assignedDate: '2025-01-12T10:00:00Z',
        comments: 'Reviewing terms and conditions. Some clauses need revision.'
      },
      {
        name: 'Finance Team',
        email: 'finance@kedco.com',
        status: 'pending',
        priority: 2,
        assignedDate: '2025-01-12T10:00:00Z'
      }
    ],
    reviewType: 'legal',
    priority: 'critical',
    deadline: '2025-01-18T23:59:59Z',
    status: 'active',
    createdDate: '2025-01-12T09:30:00Z',
    lastUpdated: '2025-01-15T14:20:00Z',
    description: 'Legal and financial review of vendor service agreement for software licensing.',
    reviewCriteria: ['Legal compliance', 'Financial terms', 'Risk assessment', 'Contract terms'],
    isUrgent: true,
    approvalThreshold: 2,
    currentApprovals: 0,
    version: '1.0',
    attachments: [
      { name: 'Vendor_Contract_TechCorp.pdf', size: '1.4 MB', type: 'pdf' }
    ],
    reviewHistory: [
      {
        id: '1',
        reviewer: 'System',
        action: 'assigned',
        timestamp: '2025-01-12T10:00:00Z'
      },
      {
        id: '2',
        reviewer: 'Legal Counsel',
        action: 'started',
        timestamp: '2025-01-14T11:30:00Z',
        comment: 'Beginning legal review of contract terms'
      },
      {
        id: '3',
        reviewer: 'Legal Counsel',
        action: 'commented',
        timestamp: '2025-01-15T14:20:00Z',
        comment: 'Found several clauses that need revision. Preparing detailed feedback.'
      }
    ]
  },
  {
    id: '4',
    documentId: 'doc-004',
    documentName: 'Quality Assurance Manual v3.0',
    documentType: 'Process Manual',
    requester: {
      name: 'Quality Team',
      email: 'quality@kedco.com',
      department: 'Quality Assurance',
      role: 'QA Manager'
    },
    assignedReviewers: [
      {
        name: 'Operations Manager',
        email: 'ops.manager@kedco.com',
        status: 'declined',
        priority: 1,
        assignedDate: '2025-01-05T08:00:00Z',
        completedDate: '2025-01-07T16:30:00Z',
        comments: 'Current procedures conflict with operational requirements. Needs revision.',
        rating: 2
      }
    ],
    reviewType: 'quality',
    priority: 'medium',
    deadline: '2025-01-30T23:59:59Z',
    status: 'overdue',
    createdDate: '2025-01-05T07:30:00Z',
    lastUpdated: '2025-01-07T16:30:00Z',
    description: 'Review of updated quality assurance procedures and implementation guidelines.',
    reviewCriteria: ['Process effectiveness', 'Implementation feasibility', 'Compliance standards'],
    isUrgent: false,
    approvalThreshold: 2,
    currentApprovals: 0,
    version: '3.0',
    reviewHistory: [
      {
        id: '1',
        reviewer: 'System',
        action: 'assigned',
        timestamp: '2025-01-05T08:00:00Z'
      },
      {
        id: '2',
        reviewer: 'Operations Manager',
        action: 'rejected',
        timestamp: '2025-01-07T16:30:00Z',
        comment: 'Current procedures conflict with operational requirements. Needs revision.',
        rating: 2
      }
    ]
  }
];

const reviewTypeColors = {
  legal: 'bg-purple-100 text-purple-700',
  technical: 'bg-blue-100 text-blue-700',
  financial: 'bg-green-100 text-green-700',
  compliance: 'bg-orange-100 text-orange-700',
  quality: 'bg-pink-100 text-pink-700',
  security: 'bg-red-100 text-red-700'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700'
};

const reviewerStatusColors = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700'
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours < 24) {
    if (diffHours < 1) return 'Just now';
    return `${Math.floor(diffHours)}h ago`;
  }
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getDaysUntilDeadline(deadline: string) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getAverageRating(reviewers: Review['assignedReviewers']) {
  const completedReviews = reviewers.filter(r => r.rating);
  if (completedReviews.length === 0) return null;
  const total = completedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  return total / completedReviews.length;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'active' | 'completed' | 'overdue' | 'cancelled'>('all');
  const [filterType, setFilterType] = useState<'all' | 'legal' | 'technical' | 'financial' | 'compliance' | 'quality' | 'security'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = !searchQuery ||
      review.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.assignedReviewers.some(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesType = filterType === 'all' || review.reviewType === filterType;
    const matchesPriority = filterPriority === 'all' || review.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const stats = {
    total: reviews.length,
    active: reviews.filter(r => r.status === 'active').length,
    completed: reviews.filter(r => r.status === 'completed').length,
    overdue: reviews.filter(r => r.status === 'overdue').length,
    pending: reviews.filter(r => r.assignedReviewers.some(rev => rev.status === 'pending')).length
  };

  const updateReviewerStatus = (reviewId: string, reviewerEmail: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'declined', comment?: string, rating?: number) => {
    setReviews(prev =>
      prev.map(review => {
        if (review.id === reviewId) {
          const updatedReviewers = review.assignedReviewers.map(reviewer => {
            if (reviewer.email === reviewerEmail) {
              return {
                ...reviewer,
                status: newStatus,
                completedDate: newStatus === 'completed' || newStatus === 'declined' ? new Date().toISOString() : reviewer.completedDate,
                comments: comment || reviewer.comments,
                rating: rating || reviewer.rating
              };
            }
            return reviewer;
          });

          // Update review status based on reviewer statuses
          let newReviewStatus = review.status;
          const completedCount = updatedReviewers.filter(r => r.status === 'completed').length;
          if (completedCount >= review.approvalThreshold) {
            newReviewStatus = 'completed';
          } else if (updatedReviewers.some(r => r.status === 'in_progress')) {
            newReviewStatus = 'active';
          }

          return {
            ...review,
            assignedReviewers: updatedReviewers,
            status: newReviewStatus,
            currentApprovals: updatedReviewers.filter(r => r.status === 'completed').length,
            lastUpdated: new Date().toISOString()
          };
        }
        return review;
      })
    );
  };

  return (
    <DashboardLayout
      title="Reviews Management"
      subtitle="Track and manage document review workflows"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
              <DocumentIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.active}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Action</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
              </div>
              <UserIcon className="h-8 w-8 text-orange-600" />
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
                placeholder="Search reviews..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="legal">Legal</option>
              <option value="technical">Technical</option>
              <option value="financial">Financial</option>
              <option value="compliance">Compliance</option>
              <option value="quality">Quality</option>
              <option value="security">Security</option>
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
              <option value="critical">Critical</option>
            </select>
          </div>

          <button className="rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Reviews ({filteredReviews.length})
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Manage document review workflows and approvals
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => {
              const daysUntilDeadline = getDaysUntilDeadline(review.deadline);
              const averageRating = getAverageRating(review.assignedReviewers);
              const isExpanded = expandedReview === review.id;

              return (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => setExpandedReview(isExpanded ? null : review.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="h-5 w-5" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5" />
                          )}
                        </button>
                        <h4 className="text-lg font-medium text-gray-900 cursor-pointer hover:text-green-600">
                          {review.documentName}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[review.status]}`}>
                          {review.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${reviewTypeColors[review.reviewType]}`}>
                          {review.reviewType}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColors[review.priority]}`}>
                          {review.priority}
                        </span>
                        {review.isUrgent && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Urgent
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {review.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          Requested by {review.requester.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Deadline: {daysUntilDeadline > 0
                            ? `${daysUntilDeadline} days`
                            : daysUntilDeadline === 0
                            ? 'Today'
                            : `${Math.abs(daysUntilDeadline)} days overdue`
                          }
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="h-3 w-3" />
                          Approvals: {review.currentApprovals}/{review.approvalThreshold}
                        </span>
                        {averageRating && (
                          <span className="flex items-center gap-1">
                            <StarIcon className="h-3 w-3" />
                            {averageRating.toFixed(1)}/5
                          </span>
                        )}
                        <span>v{review.version}</span>
                      </div>

                      {/* Reviewer Status Summary */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {review.assignedReviewers.map((reviewer, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${reviewerStatusColors[reviewer.status]}`}
                          >
                            {reviewer.name} - {reviewer.status.replace('_', ' ')}
                          </span>
                        ))}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="mt-6 space-y-4">
                          {/* Review Criteria */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Review Criteria</h5>
                            <div className="flex flex-wrap gap-2">
                              {review.reviewCriteria.map((criteria, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                                >
                                  {criteria}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Attachments */}
                          {review.attachments && review.attachments.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Attachments</h5>
                              <div className="space-y-2">
                                {review.attachments.map((attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50"
                                  >
                                    <DocumentIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">{attachment.name}</span>
                                    <span className="text-xs text-gray-500">({attachment.size})</span>
                                    <button className="ml-auto text-xs text-green-600 hover:text-green-700">
                                      View
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Detailed Reviewer Information */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Reviewer Details</h5>
                            <div className="space-y-3">
                              {review.assignedReviewers.map((reviewer, index) => (
                                <div key={index} className="rounded-lg border border-gray-200 p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-medium text-gray-900">
                                        {reviewer.name}
                                      </span>
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${reviewerStatusColors[reviewer.status]}`}>
                                        {reviewer.status.replace('_', ' ')}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        Priority {reviewer.priority}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {reviewer.rating && (
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIconSolid
                                              key={star}
                                              className={`h-4 w-4 ${
                                                star <= reviewer.rating!
                                                  ? 'text-yellow-400'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                      )}
                                      {reviewer.status === 'pending' && (
                                        <button
                                          onClick={() => updateReviewerStatus(review.id, reviewer.email, 'in_progress')}
                                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                        >
                                          Start Review
                                        </button>
                                      )}
                                      {reviewer.status === 'in_progress' && (
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => updateReviewerStatus(review.id, reviewer.email, 'completed', 'Approved', 5)}
                                            className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                                          >
                                            Approve
                                          </button>
                                          <button
                                            onClick={() => updateReviewerStatus(review.id, reviewer.email, 'declined', 'Needs revision', 2)}
                                            className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                          >
                                            Decline
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    <p>Assigned: {formatDate(reviewer.assignedDate)}</p>
                                    {reviewer.completedDate && (
                                      <p>Completed: {formatDate(reviewer.completedDate)}</p>
                                    )}
                                  </div>
                                  {reviewer.comments && (
                                    <div className="mt-2 text-sm text-gray-700">
                                      <strong>Comments:</strong> {reviewer.comments}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Review History */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-3">Review History</h5>
                            <div className="space-y-2">
                              {review.reviewHistory.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-3 text-sm">
                                  <div className="mt-1">
                                    {entry.action === 'approved' && (
                                      <CheckCircleIconSolid className="h-4 w-4 text-green-500" />
                                    )}
                                    {entry.action === 'rejected' && (
                                      <XCircleIconSolid className="h-4 w-4 text-red-500" />
                                    )}
                                    {(entry.action === 'assigned' || entry.action === 'started' || entry.action === 'commented' || entry.action === 'completed') && (
                                      <ClockIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">{entry.reviewer}</span>
                                      <span className="text-gray-600">{entry.action.replace('_', ' ')}</span>
                                      <span className="text-xs text-gray-500">
                                        {formatDate(entry.timestamp)}
                                      </span>
                                    </div>
                                    {entry.comment && (
                                      <p className="mt-1 text-gray-600">{entry.comment}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Create a new review to get started"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}