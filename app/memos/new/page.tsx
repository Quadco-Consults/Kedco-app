'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ArrowLeftIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function NewMemoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [memoType, setMemoType] = useState('APPROVAL');
  const [priority, setPriority] = useState('MEDIUM');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const departments = [
    'MD Office',
    'Finance',
    'Human Resources',
    'Operations',
    'Legal',
    'Internal Audit',
    'IT',
    'Marketing',
  ];

  const handleDepartmentToggle = (dept: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (!user) {
      setError('You must be logged in to create a memo');
      return;
    }

    if (!subject.trim() || !content.trim()) {
      setError('Subject and content are required');
      return;
    }

    if (selectedDepartments.length === 0) {
      setError('Please select at least one recipient department');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // First, get users from the selected departments to use as recipients
      const usersResponse = await fetch('/api/users');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const allUsers = await usersResponse.json();

      // Filter users by selected departments and get their IDs
      const recipientIds = allUsers
        .filter((u: any) => selectedDepartments.includes(u.department))
        .map((u: any) => u.id);

      // Create the memo
      const memoData = {
        subject,
        memoBody: content,
        type: memoType,
        priority,
        departmentId: user.departmentId || null,
        createdById: user.id,
        recipients: recipientIds,
      };

      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoData),
      });

      if (!response.ok) {
        throw new Error('Failed to create memo');
      }

      const createdMemo = await response.json();

      // If action is submit, we could update the status here
      // For now, redirect to the memos list
      router.push('/memos');
    } catch (err) {
      console.error('Error creating memo:', err);
      setError(err instanceof Error ? err.message : 'Failed to create memo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Create New Memo" subtitle="Compose and send memos to departments">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <Link
          href="/memos"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Memos
        </Link>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Memo Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Memo Type *</label>
              <select
                value={memoType}
                onChange={(e) => setMemoType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="APPROVAL">Approval Request</option>
                <option value="EXTERNAL_LETTER">External Letter (Requires MD Review)</option>
                <option value="AUDIT_LETTER">Audit Letter</option>
                <option value="INTERNAL">Internal Memo</option>
                <option value="CIRCULAR">Circular</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {memoType === 'APPROVAL' &&
                  'Request approval from MD or department heads'}
                {memoType === 'EXTERNAL_LETTER' &&
                  'External correspondence requiring MD steering and comments'}
                {memoType === 'AUDIT_LETTER' && 'Official audit communication'}
                {memoType === 'INTERNAL' && 'Internal departmental communication'}
                {memoType === 'CIRCULAR' && 'Organization-wide announcement'}
              </p>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority *</label>
              <div className="mt-2 flex gap-4">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                  <label key={p} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={(e) => setPriority(e.target.value)}
                      className="border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{p}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter memo subject..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Type your memo content here..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            </div>

            {/* Recipients - Departments */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipient Departments *
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {departments.map((dept) => (
                  <label key={dept} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(dept)}
                      onChange={() => handleDepartmentToggle(dept)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{dept}</span>
                  </label>
                ))}
              </div>
              {selectedDepartments.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedDepartments.join(', ')}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Attachments</label>
              <div className="mt-2">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:border-gray-400">
                  <PaperClipIcon className="h-5 w-5" />
                  Click to upload or drag and drop
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <PaperClipIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date (for approval memos) */}
            {memoType === 'APPROVAL' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  className="mt-1 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t pt-6">
              <Link
                href="/memos"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit('draft')}
                  disabled={submitting}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit('submit')}
                  disabled={submitting}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : (memoType === 'APPROVAL' ? 'Submit for Approval' : 'Send Memo')}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-green-900">Memo Guidelines</h4>
          <ul className="list-inside list-disc space-y-1 text-sm text-green-800">
            <li>
              <strong>Approval Request:</strong> Will be routed to MD or specified department
              heads for approval
            </li>
            <li>
              <strong>External Letter:</strong> Requires MD review and comments before
              sending externally
            </li>
            <li>
              <strong>Audit Letter:</strong> Official audit communications tracked separately
            </li>
            <li>All memos can have attachments and will maintain a complete audit trail</li>
            <li>Recipients will be notified via the system dashboard</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
