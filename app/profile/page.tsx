'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  UserIcon,
  PencilIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentIcon,
  EyeIcon,
  ClockIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CameraIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  FingerPrintIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

interface DigitalSignature {
  id: string;
  name: string;
  type: 'handwritten' | 'digital' | 'initials';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isActive: boolean;
  imageUrl?: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  title: string;
  employeeId: string;
  manager: string;
  startDate: string;
  location: string;
  timezone: string;
  avatar?: string;
  bio: string;
  preferences: {
    notifications: {
      email: boolean;
      desktop: boolean;
      mobile: boolean;
      documentUpdates: boolean;
      workflowAlerts: boolean;
      systemAnnouncements: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      showDepartment: boolean;
      allowDirectMessages: boolean;
    };
    interface: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      dateFormat: string;
      timeFormat: '12h' | '24h';
      defaultView: 'grid' | 'list';
    };
    security: {
      twoFactorEnabled: boolean;
      sessionTimeout: number;
      passwordLastChanged: string;
      securityQuestions: boolean;
    };
  };
  activity: {
    lastLogin: string;
    documentsCreated: number;
    documentsModified: number;
    workflowsInitiated: number;
    reviewsCompleted: number;
    signaturesProvided: number;
  };
  recentDocuments: {
    id: string;
    name: string;
    action: string;
    timestamp: string;
  }[];
  sessions: {
    id: string;
    device: string;
    browser: string;
    location: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
  }[];
}

const mockProfile: UserProfile = {
  id: 'user-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@kedco.com',
  phone: '+1 (555) 123-4567',
  department: 'Information Technology',
  role: 'Senior Developer',
  title: 'Senior Software Developer',
  employeeId: 'EMP-2024-0156',
  manager: 'Michael Chen',
  startDate: '2022-03-15',
  location: 'New York, NY',
  timezone: 'EST (UTC-5)',
  bio: 'Experienced software developer specializing in full-stack development with expertise in React, Node.js, and cloud technologies. Passionate about creating efficient and scalable solutions.',
  preferences: {
    notifications: {
      email: true,
      desktop: true,
      mobile: false,
      documentUpdates: true,
      workflowAlerts: true,
      systemAnnouncements: false
    },
    privacy: {
      showEmail: true,
      showPhone: false,
      showDepartment: true,
      allowDirectMessages: true
    },
    interface: {
      theme: 'light',
      language: 'en-US',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      defaultView: 'list'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordLastChanged: '2025-01-01T00:00:00Z',
      securityQuestions: true
    }
  },
  activity: {
    lastLogin: '2025-01-15T14:30:00Z',
    documentsCreated: 45,
    documentsModified: 123,
    workflowsInitiated: 12,
    reviewsCompleted: 34,
    signaturesProvided: 8
  },
  recentDocuments: [
    { id: '1', name: 'Q4 Project Report.pdf', action: 'created', timestamp: '2025-01-15T10:30:00Z' },
    { id: '2', name: 'API Documentation.docx', action: 'modified', timestamp: '2025-01-14T16:45:00Z' },
    { id: '3', name: 'Database Schema.xlsx', action: 'viewed', timestamp: '2025-01-14T14:20:00Z' },
    { id: '4', name: 'Security Guidelines.pdf', action: 'signed', timestamp: '2025-01-13T11:15:00Z' },
    { id: '5', name: 'Team Meeting Notes.docx', action: 'shared', timestamp: '2025-01-12T09:30:00Z' }
  ],
  sessions: [
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120.0',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      lastActive: '2025-01-15T14:30:00Z',
      isCurrent: true
    },
    {
      id: '2',
      device: 'iPhone 15',
      browser: 'Safari Mobile',
      location: 'New York, NY',
      ipAddress: '10.0.1.45',
      lastActive: '2025-01-15T08:15:00Z',
      isCurrent: false
    },
    {
      id: '3',
      device: 'Windows PC',
      browser: 'Edge 120.0',
      location: 'Home Office, NY',
      ipAddress: '73.85.123.45',
      lastActive: '2025-01-14T18:22:00Z',
      isCurrent: false
    }
  ]
};

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingSection({ title, description, children }: SettingSectionProps) {
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  if (diffHours < 48) return 'Yesterday';
  return time.toLocaleDateString();
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'activity' | 'signatures'>('profile');
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>(profile);

  // Digital signature state
  const [signatures, setSignatures] = useState<DigitalSignature[]>([
    {
      id: 'sig-001',
      name: 'Primary Signature',
      type: 'handwritten',
      fileName: 'john_doe_signature.png',
      fileSize: '45 KB',
      uploadedAt: '2025-01-10T10:30:00Z',
      isActive: true,
      imageUrl: '/api/placeholder/200/60' // Placeholder for signature image
    },
    {
      id: 'sig-002',
      name: 'Initials',
      type: 'initials',
      fileName: 'john_doe_initials.png',
      fileSize: '28 KB',
      uploadedAt: '2025-01-05T14:20:00Z',
      isActive: false
    }
  ]);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSave = () => {
    setProfile({ ...profile, ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updatePreference = (section: string, key: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...prev.preferences[section as keyof typeof prev.preferences],
          [key]: value
        }
      }
    }));
  };

  const terminateSession = (sessionId: string) => {
    setProfile(prev => ({
      ...prev,
      sessions: prev.sessions.filter(session => session.id !== sessionId)
    }));
  };

  // Digital signature functions
  const handleSignatureUpload = (files: File[]) => {
    setIsUploadingSignature(true);

    // Simulate upload process
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const newSignature: DigitalSignature = {
          id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: 'handwritten',
          fileName: file.name,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          uploadedAt: new Date().toISOString(),
          isActive: signatures.length === 0, // Make active if it's the first signature
          imageUrl: URL.createObjectURL(file)
        };

        setSignatures(prev => [...prev, newSignature]);
      }
    });

    setTimeout(() => setIsUploadingSignature(false), 1500);
  };

  const setActiveSignature = (signatureId: string) => {
    setSignatures(prev => prev.map(sig => ({
      ...sig,
      isActive: sig.id === signatureId
    })));
  };

  const deleteSignature = (signatureId: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== signatureId));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleSignatureUpload(files);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'activity', name: 'Activity', icon: ClockIcon },
    { id: 'signatures', name: 'Digital Signatures', icon: FingerPrintIcon }
  ];

  return (
    <DashboardLayout
      title="User Profile"
      subtitle="Manage your account information, preferences, and security settings"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <UserIcon className="h-10 w-10 text-green-600" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-white p-1 border border-gray-300 hover:bg-gray-50">
                <CameraIcon className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600">{profile.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BuildingOfficeIcon className="h-4 w-4" />
                      {profile.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Joined {new Date(profile.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <SettingSection
                    title="Personal Information"
                    description="Update your personal details and contact information"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.firstName || profile.firstName}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profile.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedProfile.lastName || profile.lastName}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profile.lastName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{profile.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editedProfile.phone || profile.phone}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Work Information"
                    description="Your role and department information"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title
                        </label>
                        <p className="text-gray-900">{profile.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <p className="text-gray-900">{profile.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee ID
                        </label>
                        <p className="text-gray-900">{profile.employeeId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Manager
                        </label>
                        <p className="text-gray-900">{profile.manager}</p>
                      </div>
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Bio"
                    description="Tell others about yourself"
                  >
                    {isEditing ? (
                      <textarea
                        value={editedProfile.bio || profile.bio}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Write something about yourself..."
                      />
                    ) : (
                      <p className="text-gray-700">{profile.bio}</p>
                    )}
                  </SettingSection>

                  {isEditing && (
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleCancel}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <SettingSection
                    title="Notification Preferences"
                    description="Choose how you want to be notified about updates and activities"
                  >
                    <div className="space-y-4">
                      {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => updatePreference('notifications', key, !value)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                              value ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                value ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Privacy Settings"
                    description="Control what information is visible to other users"
                  >
                    <div className="space-y-4">
                      {Object.entries(profile.preferences.privacy).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => updatePreference('privacy', key, !value)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                              value ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                value ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Interface Preferences"
                    description="Customize your experience with the application"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          value={profile.preferences.interface.theme}
                          onChange={(e) => updatePreference('interface', 'theme', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="system">System</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={profile.preferences.interface.language}
                          onChange={(e) => updatePreference('interface', 'language', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="en-US">English (US)</option>
                          <option value="en-GB">English (UK)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time Format
                        </label>
                        <select
                          value={profile.preferences.interface.timeFormat}
                          onChange={(e) => updatePreference('interface', 'timeFormat', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="12h">12 Hour</option>
                          <option value="24h">24 Hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default View
                        </label>
                        <select
                          value={profile.preferences.interface.defaultView}
                          onChange={(e) => updatePreference('interface', 'defaultView', e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value="grid">Grid</option>
                          <option value="list">List</option>
                        </select>
                      </div>
                    </div>
                  </SettingSection>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <SettingSection
                    title="Authentication"
                    description="Manage your login credentials and security settings"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <KeyIcon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Password</p>
                            <p className="text-xs text-gray-600">
                              Last changed: {formatDate(profile.preferences.security.passwordLastChanged)}
                            </p>
                          </div>
                        </div>
                        <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                          Change Password
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <ShieldCheckIcon className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-600">
                              {profile.preferences.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => updatePreference('security', 'twoFactorEnabled', !profile.preferences.security.twoFactorEnabled)}
                          className={`rounded-lg px-3 py-1.5 text-sm ${
                            profile.preferences.security.twoFactorEnabled
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {profile.preferences.security.twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>

                      <div className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <ClockIcon className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                              <p className="text-xs text-gray-600">Automatically log out after inactivity</p>
                            </div>
                          </div>
                        </div>
                        <select
                          value={profile.preferences.security.sessionTimeout}
                          onChange={(e) => updatePreference('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={120}>2 hours</option>
                          <option value={480}>8 hours</option>
                        </select>
                      </div>
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Active Sessions"
                    description="Monitor and manage your active login sessions"
                  >
                    <div className="space-y-3">
                      {profile.sessions.map((session) => (
                        <div key={session.id} className="p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {session.device.includes('iPhone') || session.device.includes('Mobile') ? (
                                <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                              ) : (
                                <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-900">{session.device}</p>
                                  {session.isCurrent && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">
                                  {session.browser} • {session.location} • {session.ipAddress}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Last active: {formatRelativeTime(session.lastActive)}
                                </p>
                              </div>
                            </div>
                            {!session.isCurrent && (
                              <button
                                onClick={() => terminateSession(session.id)}
                                className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                              >
                                Terminate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SettingSection>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <SettingSection
                    title="Account Activity"
                    description="Overview of your account usage and activity metrics"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg border border-gray-200">
                        <DocumentIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-gray-900">{profile.activity.documentsCreated}</p>
                        <p className="text-sm text-gray-600">Documents Created</p>
                      </div>
                      <div className="text-center p-4 rounded-lg border border-gray-200">
                        <PencilIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-gray-900">{profile.activity.documentsModified}</p>
                        <p className="text-sm text-gray-600">Documents Modified</p>
                      </div>
                      <div className="text-center p-4 rounded-lg border border-gray-200">
                        <CheckIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-semibold text-gray-900">{profile.activity.reviewsCompleted}</p>
                        <p className="text-sm text-gray-600">Reviews Completed</p>
                      </div>
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Recent Activity"
                    description="Your recent document interactions and activities"
                  >
                    <div className="space-y-3">
                      {profile.recentDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <DocumentIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-600">
                                {doc.action} • {formatRelativeTime(doc.timestamp)}
                              </p>
                            </div>
                          </div>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </SettingSection>
                </div>
              )}

              {activeTab === 'signatures' && (
                <div className="space-y-6">
                  <SettingSection
                    title="Upload Digital Signature"
                    description="Upload your digital signature for document approvals and authentication"
                  >
                    <div
                      className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                        dragActive
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      {isUploadingSignature ? (
                        <div className="flex flex-col items-center gap-3">
                          <CloudArrowUpIcon className="h-12 w-12 text-green-500 animate-pulse" />
                          <p className="text-sm font-medium text-gray-900">Uploading signature...</p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 animate-pulse"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Drag and drop your signature image, or{' '}
                              <label className="cursor-pointer text-green-600 hover:text-green-500">
                                browse to upload
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handleSignatureUpload(Array.from(e.target.files));
                                    }
                                  }}
                                />
                              </label>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 5MB. Recommended size: 400x120px
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="My Digital Signatures"
                    description="Manage your uploaded signatures and set your default signature for approvals"
                  >
                    <div className="space-y-4">
                      {signatures.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FingerPrintIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">No signatures uploaded yet</p>
                          <p className="text-xs">Upload your first signature to get started</p>
                        </div>
                      ) : (
                        signatures.map((signature) => (
                          <div
                            key={signature.id}
                            className={`p-4 rounded-lg border transition-colors ${
                              signature.isActive
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              {signature.imageUrl ? (
                                <div className="w-32 h-16 border rounded bg-white flex items-center justify-center overflow-hidden">
                                  <img
                                    src={signature.imageUrl}
                                    alt={signature.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-32 h-16 border rounded bg-gray-50 flex items-center justify-center">
                                  <FingerPrintIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}

                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-sm font-medium text-gray-900">
                                        {signature.name}
                                      </h4>
                                      {signature.isActive && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                          <CheckIcon className="h-3 w-3 mr-1" />
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                      {signature.fileName} • {signature.fileSize} •
                                      Uploaded {formatRelativeTime(signature.uploadedAt)}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs capitalize ${
                                        signature.type === 'handwritten'
                                          ? 'bg-blue-100 text-blue-700'
                                          : signature.type === 'digital'
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        {signature.type}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {!signature.isActive && (
                                      <button
                                        onClick={() => setActiveSignature(signature.id)}
                                        className="rounded-md border border-green-300 px-3 py-1.5 text-sm text-green-700 hover:bg-green-50"
                                      >
                                        Set as Active
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteSignature(signature.id)}
                                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </SettingSection>

                  <SettingSection
                    title="Signature Usage & Security"
                    description="Information about how your signatures are used and stored"
                  >
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-blue-900">Security & Privacy</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Your digital signatures are encrypted and securely stored. They are only used for
                              document approvals and authentication within this system.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-lg border border-gray-200">
                          <DocumentIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {profile.activity.signaturesProvided}
                          </p>
                          <p className="text-xs text-gray-600">Documents Signed</p>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200">
                          <CalendarIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {signatures.filter(s => s.isActive).length}
                          </p>
                          <p className="text-xs text-gray-600">Active Signatures</p>
                        </div>
                        <div className="p-4 rounded-lg border border-gray-200">
                          <ClockIcon className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {signatures.length > 0
                              ? formatRelativeTime(signatures.sort((a, b) =>
                                  new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                                )[0].uploadedAt)
                              : 'Never'
                            }
                          </p>
                          <p className="text-xs text-gray-600">Last Upload</p>
                        </div>
                      </div>
                    </div>
                  </SettingSection>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatRelativeTime(profile.activity.lastLogin)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(profile.startDate).getFullYear()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Zone</span>
                  <span className="text-sm font-medium text-gray-900">{profile.timezone}</span>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {profile.preferences.security.twoFactorEnabled ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">Strong Password</span>
                </div>
                <div className="flex items-center gap-2">
                  {profile.preferences.security.securityQuestions ? (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XMarkIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm text-gray-700">Security Questions</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                  Account Help Center
                </button>
                <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </button>
                <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                  Terms of Service
                </button>
                <button className="w-full text-left text-sm text-red-600 hover:text-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}