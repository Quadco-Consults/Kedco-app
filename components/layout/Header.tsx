'use client';

import {
  BellIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <div className="border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents, people, content..."
              className="w-80 rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 transition-all focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </button>

            {/* Messages */}
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                2
              </span>
            </button>

            {/* Notifications */}
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                5
              </span>
            </button>

            {/* Settings */}
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>

            {/* User Menu */}
            <div className="ml-2 flex items-center gap-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 px-3 py-2 shadow-sm border border-slate-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold shadow">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
