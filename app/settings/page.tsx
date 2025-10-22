'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SignatureUpload from '@/components/signatures/SignatureUpload';
import { UserCircleIcon, KeyIcon, BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [signaturePath, setSignaturePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        department: user.department || '',
        role: user.role || '',
        phone: user.phone || '',
      });
      fetchUserDetails();
    }
  }, [user]);

  const fetchUserDetails = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/users/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setSignaturePath(data.signaturePath || null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleProfileSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const updatedData = await response.json();

      // Update the user context with the new data
      updateUser({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
      });

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!user?.id) return;

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureUpload = async (fileOrDataUrl: File | string) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      let file: File;

      // If it's a data URL (drawn signature), convert to file
      if (typeof fileOrDataUrl === 'string') {
        const response = await fetch(fileOrDataUrl);
        const blob = await response.blob();
        file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
      } else {
        file = fileOrDataUrl;
      }

      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('signature', file);

      const uploadResponse = await fetch('/api/users/signature', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || 'Failed to upload signature');
      }

      const data = await uploadResponse.json();
      setSignaturePath(data.signaturePath);
      setSuccess('Signature uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading signature:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload signature');
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureRemove = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`/api/users/signature?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove signature');
      }

      setSignaturePath(null);
      setSuccess('Signature removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error removing signature:', err);
      setError(err instanceof Error ? err.message : 'Failed to remove signature');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'signature', name: 'Digital Signature', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
  ];

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Success/Error Messages */}
        {success && (
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

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
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
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
            <SignatureUpload
              currentSignature={signaturePath || undefined}
              onFileUpload={handleSignatureUpload}
              onSignatureUpdate={handleSignatureUpload}
              onRemove={handleSignatureRemove}
            />
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Security Settings</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
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
