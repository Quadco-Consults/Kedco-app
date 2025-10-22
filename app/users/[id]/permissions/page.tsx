'use client';

import { useState, use } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const permissionCategories = [
  {
    category: 'Documents',
    permissions: [
      { id: 'CREATE_DOCUMENT', name: 'Create Documents', description: 'Create new documents' },
      { id: 'VIEW_DOCUMENT', name: 'View Documents', description: 'View all documents' },
      { id: 'EDIT_DOCUMENT', name: 'Edit Documents', description: 'Edit existing documents' },
      { id: 'DELETE_DOCUMENT', name: 'Delete Documents', description: 'Delete documents' },
      { id: 'APPROVE_DOCUMENT', name: 'Approve Documents', description: 'Approve document transfers' },
    ],
  },
  {
    category: 'Memos',
    permissions: [
      { id: 'CREATE_MEMO', name: 'Create Memos', description: 'Create new memos' },
      { id: 'VIEW_MEMO', name: 'View Memos', description: 'View all memos' },
      { id: 'EDIT_MEMO', name: 'Edit Memos', description: 'Edit existing memos' },
      { id: 'DELETE_MEMO', name: 'Delete Memos', description: 'Delete memos' },
      { id: 'APPROVE_MEMO', name: 'Approve Memos', description: 'Approve and sign memos' },
    ],
  },
  {
    category: 'User Management',
    permissions: [
      { id: 'CREATE_USER', name: 'Create Users', description: 'Add new users to the system' },
      { id: 'VIEW_USER', name: 'View Users', description: 'View user information' },
      { id: 'EDIT_USER', name: 'Edit Users', description: 'Edit user details' },
      { id: 'DELETE_USER', name: 'Delete Users', description: 'Remove users from the system' },
      { id: 'MANAGE_ROLES', name: 'Manage Roles', description: 'Assign and modify user roles' },
    ],
  },
  {
    category: 'Department Management',
    permissions: [
      { id: 'CREATE_DEPARTMENT', name: 'Create Departments', description: 'Create new departments' },
      { id: 'VIEW_DEPARTMENT', name: 'View Departments', description: 'View department information' },
      { id: 'EDIT_DEPARTMENT', name: 'Edit Departments', description: 'Edit department details' },
      { id: 'DELETE_DEPARTMENT', name: 'Delete Departments', description: 'Remove departments' },
    ],
  },
];

const rolePresets = {
  MD: [
    'CREATE_DOCUMENT', 'VIEW_DOCUMENT', 'EDIT_DOCUMENT', 'APPROVE_DOCUMENT',
    'CREATE_MEMO', 'VIEW_MEMO', 'EDIT_MEMO', 'DELETE_MEMO', 'APPROVE_MEMO',
    'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER', 'MANAGE_ROLES',
    'CREATE_DEPARTMENT', 'VIEW_DEPARTMENT', 'EDIT_DEPARTMENT', 'DELETE_DEPARTMENT',
  ],
  DEPARTMENT_HEAD: [
    'CREATE_DOCUMENT', 'VIEW_DOCUMENT', 'EDIT_DOCUMENT', 'APPROVE_DOCUMENT',
    'CREATE_MEMO', 'VIEW_MEMO', 'EDIT_MEMO', 'APPROVE_MEMO',
    'VIEW_USER',
  ],
  STAFF: [
    'CREATE_DOCUMENT', 'VIEW_DOCUMENT',
    'CREATE_MEMO', 'VIEW_MEMO',
  ],
  ADMIN: [
    'CREATE_USER', 'VIEW_USER', 'EDIT_USER', 'DELETE_USER', 'MANAGE_ROLES',
    'VIEW_DOCUMENT', 'VIEW_MEMO',
    'CREATE_DEPARTMENT', 'VIEW_DEPARTMENT', 'EDIT_DEPARTMENT',
  ],
  AUDITOR: [
    'VIEW_DOCUMENT', 'VIEW_MEMO',
    'CREATE_MEMO', 'EDIT_MEMO',
  ],
};

export default function UserPermissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [userRole, setUserRole] = useState('STAFF');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    rolePresets.STAFF
  );

  const mockUser = {
    id: id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@kedco.com',
    department: 'Finance',
  };

  const handleRoleChange = (role: string) => {
    setUserRole(role);
    setSelectedPermissions(rolePresets[role as keyof typeof rolePresets] || []);
  };

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (categoryPermissions: string[]) => {
    const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p));
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !categoryPermissions.includes(p)));
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...categoryPermissions.filter((p) => !prev.includes(p)),
      ]);
    }
  };

  const handleSave = () => {
    console.log('Saving permissions:', { userId: id, role: userRole, permissions: selectedPermissions });
    // Handle save logic
  };

  return (
    <DashboardLayout
      title="Manage Permissions"
      subtitle={`${mockUser.firstName} ${mockUser.lastName} - ${mockUser.department}`}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Users
        </Link>

        {/* User Info Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-xl font-medium text-green-600">
              {mockUser.firstName[0]}
              {mockUser.lastName[0]}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {mockUser.firstName} {mockUser.lastName}
              </h3>
              <p className="text-sm text-gray-500">{mockUser.email}</p>
              <p className="text-sm text-gray-500">{mockUser.department}</p>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">User Role</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(rolePresets).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`rounded-lg border-2 p-4 text-left transition-colors ${
                  userRole === role
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {role.replace(/_/g, ' ')}
                  </span>
                  {userRole === role && (
                    <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {rolePresets[role as keyof typeof rolePresets].length} permissions
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
            <span className="text-sm text-gray-500">
              {selectedPermissions.length} permissions selected
            </span>
          </div>

          <div className="space-y-6">
            {permissionCategories.map((category) => {
              const categoryPermissionIds = category.permissions.map((p) => p.id);
              const allCategorySelected = categoryPermissionIds.every((p) =>
                selectedPermissions.includes(p)
              );
              const someCategorySelected = categoryPermissionIds.some((p) =>
                selectedPermissions.includes(p)
              );

              return (
                <div key={category.category} className="border-b pb-6 last:border-b-0">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{category.category}</h4>
                    <button
                      onClick={() => handleSelectAll(categoryPermissionIds)}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      {allCategorySelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {category.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionToggle(permission.id)}
                          className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {permission.name}
                          </p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow">
          <Link
            href="/users"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
