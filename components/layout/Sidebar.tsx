'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import {
  HomeIcon,
  DocumentIcon,
  EnvelopeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ClockIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BellIcon,
  InboxIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

const navigationSections = [
  {
    name: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
      { name: 'Recent Activity', href: '/activity', icon: ClockIcon, badge: '5' },
      { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, badge: null },
    ]
  },
  {
    name: 'Document Management',
    items: [
      { name: 'All Documents', href: '/documents', icon: DocumentIcon, badge: '247' },
      { name: 'My Documents', href: '/documents/my', icon: FolderIcon, badge: '12' },
      { name: 'Shared with Me', href: '/documents/shared', icon: DocumentDuplicateIcon, badge: '8' },
      { name: 'Archives', href: '/documents/archived', icon: ArchiveBoxIcon, badge: null },
    ]
  },
  {
    name: 'Communication',
    items: [
      { name: 'Memos', href: '/memos', icon: EnvelopeIcon, badge: '3' },
      { name: 'Notifications', href: '/notifications', icon: BellIcon, badge: '15' },
      { name: 'Inbox', href: '/inbox', icon: InboxIcon, badge: '7' },
    ]
  },
  {
    name: 'Workflows',
    items: [
      { name: 'Approvals', href: '/approvals', icon: ShieldCheckIcon, badge: '4' },
      { name: 'Reviews', href: '/reviews', icon: DocumentTextIcon, badge: '2' },
      { name: 'Signatures', href: '/signatures', icon: PencilSquareIcon, badge: '6' },
    ]
  },
  {
    name: 'Administration',
    items: [
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, badge: null },
      { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon, badge: null },
      { name: 'Users & Roles', href: '/users', icon: UserGroupIcon, badge: null },
      { name: 'System', href: '/settings', icon: Cog6ToothIcon, badge: null },
    ]
  }
];

const roleLabels: Record<string, string> = {
  MD: 'Managing Director',
  DEPARTMENT_HEAD: 'Department Head',
  STAFF: 'Staff',
  ADMIN: 'Administrator',
  AUDITOR: 'Auditor',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionName: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionName)) {
      newCollapsed.delete(sectionName);
    } else {
      newCollapsed.add(sectionName);
    }
    setCollapsedSections(newCollapsed);
  };

  return (
    <div className="flex h-screen w-72 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl">
      {/* Logo/Brand */}
      <div className="flex h-20 items-center justify-center border-b border-slate-700 px-6">
        <div className="flex items-center gap-3">
          <img src="/KEDCO.jpg" alt="KEDCO" className="h-14 w-auto rounded-lg" />
          <div className="text-left">
            <h1 className="text-xl font-bold text-white">KEDCO ECM</h1>
            <p className="text-xs text-slate-300">Enterprise Content Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {navigationSections.map((section) => {
            const isCollapsed = collapsedSections.has(section.name);
            return (
              <div key={section.name}>
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.name)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
                >
                  <span className="uppercase tracking-wider">{section.name}</span>
                  {isCollapsed ? (
                    <ChevronRightIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="mt-2 space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span className={`inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-medium rounded-full ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-600 text-slate-200 group-hover:bg-slate-500'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-700 bg-slate-900/50 p-4">
        {user && (
          <>
            <div className="mb-4 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 p-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
                  <span className="text-sm font-bold">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-300">{roleLabels[user.role] || user.role}</p>
                  <p className="truncate text-xs text-green-400">{user.department?.name || 'KEDCO'}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link
                href="/profile"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                <UsersIcon className="h-4 w-4" />
                My Profile
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
