'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  StarIcon,
  TrashIcon,
  ArrowLeftIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArchiveBoxIcon,
  ForwardIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
} from '@heroicons/react/24/solid';

interface Message {
  id: string;
  from: {
    name: string;
    email: string;
    role: string;
    department: string;
  };
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
  labels: string[];
  thread?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    from: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@kedco.com',
      role: 'Finance Director',
      department: 'Finance'
    },
    to: ['finance-team@kedco.com'],
    cc: ['admin@kedco.com'],
    subject: 'Q4 Budget Review Meeting - Action Items',
    body: 'Dear Team,\n\nFollowing our Q4 budget review meeting, please find the action items that need immediate attention:\n\n1. Revenue projection updates\n2. Department budget allocations\n3. Capital expenditure approvals\n\nPlease complete these by Friday.\n\nBest regards,\nSarah',
    timestamp: '2025-01-15T14:30:00Z',
    isRead: false,
    isStarred: true,
    isImportant: true,
    hasAttachments: true,
    attachments: [
      { name: 'Q4_Budget_Summary.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Action_Items.xlsx', size: '456 KB', type: 'excel' }
    ],
    labels: ['urgent', 'finance'],
    thread: 'budget-review-2024'
  },
  {
    id: '2',
    from: {
      name: 'Michael Chen',
      email: 'michael.chen@kedco.com',
      role: 'IT Manager',
      department: 'Information Technology'
    },
    to: ['all-staff@kedco.com'],
    subject: 'System Maintenance Window - This Weekend',
    body: 'Dear All,\n\nWe will be performing scheduled system maintenance this weekend:\n\nDate: Saturday, January 18th\nTime: 2:00 AM - 6:00 AM\n\nSystems affected:\n- Document Management System\n- Email Server\n- File Servers\n\nPlease save your work before the maintenance window.\n\nIT Team',
    timestamp: '2025-01-15T11:20:00Z',
    isRead: true,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    labels: ['it', 'maintenance'],
    thread: 'system-maintenance'
  },
  {
    id: '3',
    from: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@kedco.com',
      role: 'Project Manager',
      department: 'Operations'
    },
    to: ['project-leads@kedco.com'],
    subject: 'Project Alpha - Milestone Update',
    body: 'Hi Project Leads,\n\nProject Alpha has reached the following milestones:\n\n✅ Phase 1: Requirements gathering (Complete)\n✅ Phase 2: System design (Complete)\n🔄 Phase 3: Development (In Progress - 60%)\n⏳ Phase 4: Testing (Pending)\n\nNext review meeting: January 20th at 2 PM\n\nRegards,\nEmily',
    timestamp: '2025-01-15T09:45:00Z',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachments: true,
    attachments: [
      { name: 'Project_Alpha_Timeline.pdf', size: '1.2 MB', type: 'pdf' }
    ],
    labels: ['project', 'milestone'],
    thread: 'project-alpha'
  },
  {
    id: '4',
    from: {
      name: 'David Wilson',
      email: 'david.wilson@kedco.com',
      role: 'Safety Officer',
      department: 'Safety & Compliance'
    },
    to: ['department-heads@kedco.com'],
    subject: 'Updated Safety Guidelines - Immediate Implementation',
    body: 'Dear Department Heads,\n\nPlease find attached the updated safety guidelines that must be implemented immediately:\n\n- Emergency evacuation procedures\n- Equipment handling protocols\n- Incident reporting forms\n\nAll staff must be briefed by end of week.\n\nStay safe,\nDavid',
    timestamp: '2025-01-14T16:30:00Z',
    isRead: true,
    isStarred: true,
    isImportant: true,
    hasAttachments: true,
    attachments: [
      { name: 'Safety_Guidelines_2025.pdf', size: '3.1 MB', type: 'pdf' },
      { name: 'Incident_Report_Form.docx', size: '124 KB', type: 'word' }
    ],
    labels: ['safety', 'urgent'],
    thread: 'safety-updates'
  },
  {
    id: '5',
    from: {
      name: 'James Anderson',
      email: 'james.anderson@kedco.com',
      role: 'HR Manager',
      department: 'Human Resources'
    },
    to: ['all-staff@kedco.com'],
    subject: 'Annual Performance Reviews - Schedule Confirmation',
    body: 'Dear Team,\n\nAnnual performance reviews are scheduled for the coming weeks. Please check your calendar for your assigned time slot.\n\nReview documents have been shared in your personal folders.\n\nIf you have scheduling conflicts, please contact HR immediately.\n\nBest,\nJames',
    timestamp: '2025-01-14T10:15:00Z',
    isRead: false,
    isStarred: false,
    isImportant: false,
    hasAttachments: false,
    labels: ['hr', 'reviews'],
    thread: 'performance-reviews'
  }
];

const messageFilters = [
  { id: 'all', name: 'All Messages', count: 47, icon: EnvelopeIcon },
  { id: 'unread', name: 'Unread', count: 12, icon: EnvelopeIcon },
  { id: 'starred', name: 'Starred', count: 8, icon: StarIcon },
  { id: 'important', name: 'Important', count: 5, icon: ExclamationTriangleIcon },
  { id: 'sent', name: 'Sent', count: 23, icon: ArrowLeftIcon },
  { id: 'drafts', name: 'Drafts', count: 3, icon: EnvelopeOpenIcon },
  { id: 'archived', name: 'Archived', count: 156, icon: ArchiveBoxIcon },
  { id: 'trash', name: 'Trash', count: 7, icon: TrashIcon },
];

const labelColors = {
  urgent: 'bg-red-100 text-red-700',
  finance: 'bg-blue-100 text-blue-700',
  it: 'bg-purple-100 text-purple-700',
  maintenance: 'bg-orange-100 text-orange-700',
  project: 'bg-green-100 text-green-700',
  milestone: 'bg-yellow-100 text-yellow-700',
  safety: 'bg-red-100 text-red-700',
  hr: 'bg-indigo-100 text-indigo-700',
  reviews: 'bg-pink-100 text-pink-700',
};

function formatTimestamp(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return time.toLocaleDateString();
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = !searchQuery ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.body.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'unread' && !message.isRead) ||
      (selectedFilter === 'starred' && message.isStarred) ||
      (selectedFilter === 'important' && message.isImportant);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const toggleStar = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      )
    );
  };

  const markAllAsRead = () => {
    setMessages(prev =>
      prev.map(msg => ({ ...msg, isRead: true }))
    );
  };

  const deleteSelected = () => {
    setMessages(prev =>
      prev.filter(msg => !selectedMessages.includes(msg.id))
    );
    setSelectedMessages([]);
  };

  const selectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message.id);
    }
  };

  return (
    <DashboardLayout
      title="Inbox"
      subtitle="Manage your messages and communications"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCompose(true)}
              className="rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700"
            >
              Compose
            </button>
            <div className="flex items-center gap-2">
              {selectedMessages.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete ({selectedMessages.length})
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <FunnelIcon className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Message Stats */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inbox Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Messages</span>
                  <span className="text-sm font-semibold text-gray-900">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Unread</span>
                  <span className="text-sm font-semibold text-red-600">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Starred</span>
                  <span className="text-sm font-semibold text-yellow-600">
                    {messages.filter(m => m.isStarred).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Important</span>
                  <span className="text-sm font-semibold text-orange-600">
                    {messages.filter(m => m.isImportant).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
              <div className="space-y-2">
                {messageFilters.map(filter => {
                  const IconComponent = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        selectedFilter === filter.id
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4" />
                        <span>{filter.name}</span>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {filter.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Message List or Detail View */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              /* Message Detail View */
              <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                {/* Message Header */}
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeftIcon className="h-4 w-4" />
                      Back to Inbox
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleStar(selectedMessage.id)}
                        className="p-2 text-gray-400 hover:text-yellow-500"
                      >
                        {selectedMessage.isStarred ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5" />
                        )}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <ForwardIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {selectedMessage.subject}
                    </h1>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-green-600">
                            {selectedMessage.from.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {selectedMessage.from.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {selectedMessage.from.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1"></div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatTimestamp(selectedMessage.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMessage.from.role}, {selectedMessage.from.department}
                        </p>
                      </div>
                    </div>

                    {selectedMessage.isImportant && (
                      <div className="flex items-center gap-2">
                        <ExclamationTriangleIconSolid className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700 font-medium">Important</span>
                      </div>
                    )}

                    {selectedMessage.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.labels.map((label, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              labelColors[label as keyof typeof labelColors] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="px-6 py-6">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                      {selectedMessage.body}
                    </pre>
                  </div>

                  {selectedMessage.hasAttachments && selectedMessage.attachments && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Attachments ({selectedMessage.attachments.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <PaperClipIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {attachment.size} • {attachment.type.toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Actions */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-medium hover:bg-green-700">
                      Reply
                    </button>
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 text-sm hover:bg-gray-50">
                      Reply All
                    </button>
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 text-sm hover:bg-gray-50">
                      Forward
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Message List View */
              <div className="rounded-lg bg-white shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {filteredMessages.length} messages in {selectedFilter}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMessages(filteredMessages.map(m => m.id));
                          } else {
                            setSelectedMessages([]);
                          }
                        }}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600">Select All</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !message.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => selectMessage(message)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (e.target.checked) {
                            setSelectedMessages([...selectedMessages, message.id]);
                          } else {
                            setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                          }
                        }}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(message.id);
                        }}
                        className="p-1"
                      >
                        {message.isStarred ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <StarIcon className="h-5 w-5 text-gray-400 hover:text-yellow-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm ${!message.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {message.from.name}
                          </p>
                          {message.isImportant && (
                            <ExclamationTriangleIconSolid className="h-4 w-4 text-red-500" />
                          )}
                          {message.hasAttachments && (
                            <PaperClipIcon className="h-4 w-4 text-gray-400" />
                          )}
                          {!message.isRead && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full" />
                          )}
                        </div>

                        <p className={`text-sm mb-1 ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {message.subject}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          {message.body.substring(0, 100)}...
                        </p>

                        {message.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {message.labels.slice(0, 2).map((label, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                  labelColors[label as keyof typeof labelColors] || 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {label}
                              </span>
                            ))}
                            {message.labels.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{message.labels.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.from.department}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {filteredMessages.length} of {messages.length} messages
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}