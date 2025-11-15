'use client';

import { useState, useEffect } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  TrashIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  TagIcon,
  UserGroupIcon,
  FolderIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  status: string;
  priority: string;
  currentDepartment: string;
  isExternal: boolean;
  createdBy: string;
  createdAt: string;
}

interface BulkOperation {
  type: 'transfer' | 'archive' | 'delete' | 'priority' | 'status' | 'export';
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  requiresConfirmation: boolean;
  dangerLevel: 'low' | 'medium' | 'high';
}

interface BulkOperationsProps {
  documents: Document[];
  selectedDocuments: string[];
  onDocumentsChange: (documents: Document[]) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  className?: string;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function BulkOperations({
  documents,
  selectedDocuments,
  onDocumentsChange,
  onSelectionChange,
  className = ''
}: BulkOperationsProps) {
  const [showOperationsMenu, setShowOperationsMenu] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [operationData, setOperationData] = useState<{
    targetDepartment?: string;
    newPriority?: string;
    newStatus?: string;
    exportFormat?: string;
    notes?: string;
  }>({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const bulkOperations: BulkOperation[] = [
    {
      type: 'transfer',
      label: 'Transfer to Department',
      icon: FolderIcon,
      description: 'Move selected documents to a different department',
      requiresConfirmation: true,
      dangerLevel: 'medium'
    },
    {
      type: 'priority',
      label: 'Change Priority',
      icon: TagIcon,
      description: 'Update priority level for selected documents',
      requiresConfirmation: false,
      dangerLevel: 'low'
    },
    {
      type: 'status',
      label: 'Update Status',
      icon: ArrowPathIcon,
      description: 'Change status for selected documents',
      requiresConfirmation: true,
      dangerLevel: 'medium'
    },
    {
      type: 'archive',
      label: 'Archive Documents',
      icon: ArchiveBoxIcon,
      description: 'Archive selected documents (they will be moved to archived status)',
      requiresConfirmation: true,
      dangerLevel: 'medium'
    },
    {
      type: 'export',
      label: 'Export Documents',
      icon: DocumentDuplicateIcon,
      description: 'Export selected documents data to file',
      requiresConfirmation: false,
      dangerLevel: 'low'
    },
    {
      type: 'delete',
      label: 'Delete Documents',
      icon: TrashIcon,
      description: 'Permanently delete selected documents (cannot be undone)',
      requiresConfirmation: true,
      dangerLevel: 'high'
    }
  ];

  const handleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(documents.map(doc => doc.id));
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      onSelectionChange(selectedDocuments.filter(id => id !== documentId));
    } else {
      onSelectionChange([...selectedDocuments, documentId]);
    }
  };

  const handleOperationSelect = (operation: BulkOperation) => {
    setSelectedOperation(operation);
    setShowOperationsMenu(false);

    if (operation.requiresConfirmation) {
      setShowConfirmationDialog(true);
    } else {
      executeOperation(operation);
    }
  };

  const executeOperation = async (operation: BulkOperation) => {
    setIsExecuting(true);

    try {
      const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));

      switch (operation.type) {
        case 'transfer':
          if (operationData.targetDepartment) {
            await bulkTransfer(selectedDocs, operationData.targetDepartment);
          }
          break;
        case 'archive':
          await bulkArchive(selectedDocs);
          break;
        case 'delete':
          await bulkDelete(selectedDocs);
          break;
        case 'priority':
          if (operationData.newPriority) {
            await bulkUpdatePriority(selectedDocs, operationData.newPriority);
          }
          break;
        case 'status':
          if (operationData.newStatus) {
            await bulkUpdateStatus(selectedDocs, operationData.newStatus);
          }
          break;
        case 'export':
          await bulkExport(selectedDocs, operationData.exportFormat || 'csv');
          break;
      }

      // Clear selection after operation
      onSelectionChange([]);
    } catch (error) {
      console.error('Error executing bulk operation:', error);
    } finally {
      setIsExecuting(false);
      setShowConfirmationDialog(false);
      setSelectedOperation(null);
      setOperationData({});
    }
  };

  const bulkTransfer = async (docs: Document[], targetDepartment: string) => {
    for (const doc of docs) {
      await fetch(`/api/documents/${doc.id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetDepartment,
          notes: operationData.notes || `Bulk transfer to ${targetDepartment}`
        })
      });
    }

    // Update local state
    const updatedDocs = documents.map(doc =>
      selectedDocuments.includes(doc.id)
        ? { ...doc, currentDepartment: targetDepartment, status: 'IN_TRANSIT' }
        : doc
    );
    onDocumentsChange(updatedDocs);
  };

  const bulkArchive = async (docs: Document[]) => {
    for (const doc of docs) {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' })
      });
    }

    // Update local state
    const updatedDocs = documents.map(doc =>
      selectedDocuments.includes(doc.id)
        ? { ...doc, status: 'ARCHIVED' }
        : doc
    );
    onDocumentsChange(updatedDocs);
  };

  const bulkDelete = async (docs: Document[]) => {
    for (const doc of docs) {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE'
      });
    }

    // Remove from local state
    const updatedDocs = documents.filter(doc => !selectedDocuments.includes(doc.id));
    onDocumentsChange(updatedDocs);
  };

  const bulkUpdatePriority = async (docs: Document[], newPriority: string) => {
    for (const doc of docs) {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority })
      });
    }

    // Update local state
    const updatedDocs = documents.map(doc =>
      selectedDocuments.includes(doc.id)
        ? { ...doc, priority: newPriority }
        : doc
    );
    onDocumentsChange(updatedDocs);
  };

  const bulkUpdateStatus = async (docs: Document[], newStatus: string) => {
    for (const doc of docs) {
      await fetch(`/api/documents/${doc.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    }

    // Update local state
    const updatedDocs = documents.map(doc =>
      selectedDocuments.includes(doc.id)
        ? { ...doc, status: newStatus }
        : doc
    );
    onDocumentsChange(updatedDocs);
  };

  const bulkExport = async (docs: Document[], format: string) => {
    const response = await fetch('/api/documents/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentIds: docs.map(doc => doc.id),
        format
      })
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documents-export-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const getOperationColor = (dangerLevel: string) => {
    switch (dangerLevel) {
      case 'high': return 'text-red-600 hover:bg-red-50';
      case 'medium': return 'text-orange-600 hover:bg-orange-50';
      default: return 'text-gray-600 hover:bg-gray-50';
    }
  };

  const isAllSelected = selectedDocuments.length === documents.length && documents.length > 0;
  const isSomeSelected = selectedDocuments.length > 0 && selectedDocuments.length < documents.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bulk Selection Header */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Select All Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isSomeSelected;
              }}
              onChange={handleSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({documents.length})
            </span>
          </label>

          {selectedDocuments.length > 0 && (
            <span className="text-sm text-gray-500">
              {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} selected
            </span>
          )}
        </div>

        {/* Bulk Operations Menu */}
        {selectedDocuments.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowOperationsMenu(!showOperationsMenu)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <UserGroupIcon className="h-4 w-4" />
              Bulk Actions
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {/* Operations Dropdown */}
            {showOperationsMenu && (
              <div className="absolute right-0 top-full mt-1 w-72 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-10">
                {bulkOperations.map((operation) => (
                  <button
                    key={operation.type}
                    onClick={() => handleOperationSelect(operation)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 ${getOperationColor(operation.dangerLevel)}`}
                  >
                    <operation.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{operation.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{operation.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Selection List */}
      <div className="space-y-2">
        {documents.map((document) => (
          <label
            key={document.id}
            className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${
              selectedDocuments.includes(document.id)
                ? 'border-green-300 bg-green-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedDocuments.includes(document.id)}
              onChange={() => handleDocumentSelect(document.id)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 truncate">{document.title}</p>
                  <p className="text-sm text-gray-500">{document.referenceNumber}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    document.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    document.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                    document.status === 'UNDER_REVIEW' ? 'bg-purple-100 text-purple-800' :
                    document.status === 'RECEIVED' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {document.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs">{document.currentDepartment}</span>
                  <span className="text-xs">{new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmationDialog && selectedOperation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                selectedOperation.dangerLevel === 'high' ? 'bg-red-100' :
                selectedOperation.dangerLevel === 'medium' ? 'bg-orange-100' :
                'bg-gray-100'
              }`}>
                <selectedOperation.icon className={`h-6 w-6 ${
                  selectedOperation.dangerLevel === 'high' ? 'text-red-600' :
                  selectedOperation.dangerLevel === 'medium' ? 'text-orange-600' :
                  'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedOperation.label}</h3>
                <p className="text-sm text-gray-600">{selectedOperation.description}</p>
              </div>
            </div>

            {/* Operation-specific inputs */}
            <div className="mb-6 space-y-4">
              {selectedOperation.type === 'transfer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Department
                    </label>
                    <select
                      value={operationData.targetDepartment || ''}
                      onChange={(e) => setOperationData({...operationData, targetDepartment: e.target.value})}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="">Select department...</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={operationData.notes || ''}
                      onChange={(e) => setOperationData({...operationData, notes: e.target.value})}
                      rows={3}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Add transfer notes..."
                    />
                  </div>
                </>
              )}

              {selectedOperation.type === 'priority' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Priority
                  </label>
                  <select
                    value={operationData.newPriority || ''}
                    onChange={(e) => setOperationData({...operationData, newPriority: e.target.value})}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select priority...</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              )}

              {selectedOperation.type === 'status' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    value={operationData.newStatus || ''}
                    onChange={(e) => setOperationData({...operationData, newStatus: e.target.value})}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="">Select status...</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="RECEIVED">Received</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              )}

              {selectedOperation.type === 'export' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={operationData.exportFormat || 'csv'}
                    onChange={(e) => setOperationData({...operationData, exportFormat: e.target.value})}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    <option value="csv">CSV</option>
                    <option value="xlsx">Excel</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF Report</option>
                  </select>
                </div>
              )}
            </div>

            {/* Warning for dangerous operations */}
            {selectedOperation.dangerLevel === 'high' && (
              <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Warning: This action cannot be undone!</p>
                  <p>The selected documents will be permanently deleted from the system.</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-6">
              This action will affect {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''}.
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmationDialog(false);
                  setSelectedOperation(null);
                  setOperationData({});
                }}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => executeOperation(selectedOperation)}
                disabled={isExecuting}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  selectedOperation.dangerLevel === 'high'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                } disabled:opacity-50`}
              >
                {isExecuting ? 'Processing...' : `Confirm ${selectedOperation.label}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}