'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';

const mockDepartments = [
  {
    id: '1',
    name: 'MD Office',
    code: 'MDO',
    head: 'Dr. Ibrahim Yusuf',
    headEmail: 'ibrahim.y@kedco.com',
    description: 'Managing Director Office',
    staffCount: 5,
    activeDocuments: 12,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Finance',
    code: 'FIN',
    head: 'John Doe',
    headEmail: 'john.doe@kedco.com',
    description: 'Financial operations and accounting',
    staffCount: 15,
    activeDocuments: 45,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Human Resources',
    code: 'HR',
    head: 'Jane Smith',
    headEmail: 'jane.smith@kedco.com',
    description: 'Personnel management and development',
    staffCount: 8,
    activeDocuments: 23,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '4',
    name: 'Operations',
    code: 'OPS',
    head: 'Mike Johnson',
    headEmail: 'mike.j@kedco.com',
    description: 'Daily operations and service delivery',
    staffCount: 35,
    activeDocuments: 67,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    name: 'Internal Audit',
    code: 'IA',
    head: 'Sarah Williams',
    headEmail: 'sarah.w@kedco.com',
    description: 'Internal audit and compliance',
    staffCount: 6,
    activeDocuments: 18,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '6',
    name: 'Legal',
    code: 'LEG',
    head: 'David Brown',
    headEmail: 'david.b@kedco.com',
    description: 'Legal services and regulatory compliance',
    staffCount: 4,
    activeDocuments: 15,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '7',
    name: 'Information Technology',
    code: 'IT',
    head: 'Lisa Chen',
    headEmail: 'lisa.c@kedco.com',
    description: 'IT infrastructure and systems',
    staffCount: 10,
    activeDocuments: 8,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '8',
    name: 'Marketing',
    code: 'MKT',
    head: 'Ahmed Hassan',
    headEmail: 'ahmed.h@kedco.com',
    description: 'Marketing and customer relations',
    staffCount: 7,
    activeDocuments: 11,
    isActive: true,
    createdAt: '2024-01-01',
  },
];

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<typeof mockDepartments[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    description: '',
  });

  const filteredDepartments = mockDepartments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    console.log('Adding department:', formData);
    setShowAddModal(false);
    setFormData({ name: '', code: '', head: '', description: '' });
  };

  const handleEdit = (dept: typeof mockDepartments[0]) => {
    setSelectedDepartment(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      description: dept.description,
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!selectedDepartment) return;
    console.log('Updating department:', selectedDepartment.id, formData);
    setShowEditModal(false);
    setSelectedDepartment(null);
    setFormData({ name: '', code: '', head: '', description: '' });
  };

  return (
    <DashboardLayout
      title="Department Management"
      subtitle="Manage organizational departments and structure"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4" />
            Add Department
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Departments</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{mockDepartments.length}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Total Staff</p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {mockDepartments.reduce((sum, dept) => sum + dept.staffCount, 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Active Documents</p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {mockDepartments.reduce((sum, dept) => sum + dept.activeDocuments, 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-600">Avg Staff per Dept</p>
            <p className="mt-2 text-3xl font-semibold text-purple-600">
              {Math.round(
                mockDepartments.reduce((sum, dept) => sum + dept.staffCount, 0) /
                  mockDepartments.length
              )}
            </p>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-sm text-gray-500">Code: {dept.code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit Department"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    title="Delete Department"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mb-4 text-sm text-gray-600">{dept.description}</p>

              <div className="mb-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-500">Department Head</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{dept.head}</p>
                <p className="text-xs text-gray-500">{dept.headEmail}</p>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4" />
                  <span>{dept.staffCount} staff</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <DocumentIcon className="h-4 w-4" />
                  <span>{dept.activeDocuments} docs</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDepartments.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <p className="text-gray-500">No departments found</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Department</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g., Procurement"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="e.g., PROC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Head</label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select user...</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Brief description of the department..."
                />
              </div>
            </form>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Add Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Edit Department</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department Head</label>
                <select
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Select user...</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            </form>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Update Department
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
