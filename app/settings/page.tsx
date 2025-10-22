'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SignatureUpload from '@/components/signatures/SignatureUpload';
import { UserCircleIcon, KeyIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@kedco.com',
    department: 'Finance',
    role: 'Department Head',
    phone: '+234 123 456 7890',
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'signature', name: 'Digital Signature', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  const handleSave = () => {
    console.log('Saving settings:', formData);
    // Handle save logic
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Profile Information</h3>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    disabled
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    disabled
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Signature Tab */}
        {activeTab === 'signature' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Digital Signature</h3>
            <p className="mb-6 text-sm text-gray-600">
              Upload or draw your signature to be used on documents and memos
            </p>
            <SignatureUpload />
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Security Settings</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Enable two-factor authentication</span>
                </label>
              </div>

              <div className="flex justify-end border-t pt-4">
                <button
                  type="button"
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">New Document Assignments</p>
                  <p className="text-sm text-gray-500">
                    Get notified when documents are assigned to you
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">Memo Approvals</p>
                  <p className="text-sm text-gray-500">
                    Get notified when memos require your approval
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">Comments & Minutes</p>
                  <p className="text-sm text-gray-500">
                    Get notified when someone comments on your documents
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium text-gray-900">Department Updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified about department announcements
                  </p>
                </div>
                <input type="checkbox" className="rounded border-gray-300" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive email notifications for important updates
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              </div>

              <div className="flex justify-end border-t pt-4">
                <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
