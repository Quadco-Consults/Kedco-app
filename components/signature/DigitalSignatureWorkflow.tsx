'use client';

import { useState, useRef, useEffect } from 'react';
import {
  PencilIcon,
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  UserIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface SignatureRequest {
  id: string;
  documentId: string;
  documentTitle: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  signers: SignerInfo[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  dueDate?: string;
  message?: string;
}

interface SignerInfo {
  id: string;
  email: string;
  name: string;
  role: string;
  order: number;
  status: 'PENDING' | 'SIGNED' | 'DECLINED' | 'EXPIRED';
  signedAt?: string;
  ipAddress?: string;
  signature?: string;
  comments?: string;
}

interface DigitalSignatureWorkflowProps {
  documentId: string;
  documentTitle: string;
  onSignatureComplete: () => void;
  className?: string;
}

export default function DigitalSignatureWorkflow({
  documentId,
  documentTitle,
  onSignatureComplete,
  className = ''
}: DigitalSignatureWorkflowProps) {
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SignatureRequest | null>(null);
  const [signers, setSigners] = useState<Omit<SignerInfo, 'id' | 'status'>[]>([]);
  const [message, setMessage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showSigningPad, setShowSigningPad] = useState(false);
  const [currentSignature, setCurrentSignature] = useState('');

  // Canvas for signature drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchSignatureRequests();
  }, [documentId]);

  const fetchSignatureRequests = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/signatures`);
      if (response.ok) {
        const data = await response.json();
        setSignatureRequests(data);
      }
    } catch (error) {
      console.error('Error fetching signature requests:', error);
    }
  };

  const addSigner = () => {
    setSigners([...signers, {
      email: '',
      name: '',
      role: '',
      order: signers.length + 1
    }]);
  };

  const removeSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: keyof Omit<SignerInfo, 'id' | 'status'>, value: string | number) => {
    const updated = [...signers];
    updated[index] = { ...updated[index], [field]: value };
    setSigners(updated);
  };

  const createSignatureRequest = async () => {
    if (signers.length === 0) return;

    try {
      const response = await fetch(`/api/documents/${documentId}/signatures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentTitle,
          signers,
          message,
          dueDate: dueDate || undefined
        })
      });

      if (response.ok) {
        setShowCreateRequest(false);
        setSigners([]);
        setMessage('');
        setDueDate('');
        fetchSignatureRequests();
      }
    } catch (error) {
      console.error('Error creating signature request:', error);
    }
  };

  // Signature pad functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setCurrentSignature(dataURL);
    setShowSigningPad(false);
    // Here you would typically send the signature to your API
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'SIGNED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'SIGNED':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'PENDING':
      case 'IN_PROGRESS':
        return <ClockIcon className="h-4 w-4" />;
      case 'CANCELLED':
      case 'DECLINED':
      case 'EXPIRED':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <DocumentIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Digital Signatures</h3>
          <p className="text-sm text-gray-500">Manage signature requests for this document</p>
        </div>
        <button
          onClick={() => setShowCreateRequest(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PencilIcon className="h-4 w-4" />
          Request Signatures
        </button>
      </div>

      {/* Signature Requests List */}
      <div className="space-y-4">
        {signatureRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DocumentIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No signature requests for this document</p>
            <p className="text-xs">Click "Request Signatures" to get started</p>
          </div>
        ) : (
          signatureRequests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">
                      Created by {request.requestedBy.name}
                    </span>
                    {request.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due: {new Date(request.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 mt-1">{request.message || 'Signature request'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{request.signers.length} signer(s)</p>
                  <p className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRequest?.id === request.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Signers</h4>
                      <div className="space-y-2">
                        {request.signers.map((signer) => (
                          <div key={signer.id} className="flex items-center justify-between p-3 bg-white rounded border">
                            <div className="flex items-center gap-3">
                              <UserIcon className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{signer.name}</p>
                                <p className="text-xs text-gray-500">{signer.email} • {signer.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(signer.status)}`}>
                                {getStatusIcon(signer.status)}
                                {signer.status}
                              </span>
                              {signer.signedAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Signed: {new Date(signer.signedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowSigningPad(true)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Sign Document
                      </button>
                      <button className="px-3 py-2 text-sm text-gray-600 border rounded hover:bg-gray-50">
                        Send Reminder
                      </button>
                      <button className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50">
                        Cancel Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Signature Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Request Digital Signatures</h3>
              <button
                onClick={() => setShowCreateRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Document Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-1">Document</h4>
                <p className="text-sm text-gray-600">{documentTitle}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Signers
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Please sign this document..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Signers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signers
                </label>
                <div className="space-y-3">
                  {signers.map((signer, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 p-3 border border-gray-200 rounded-lg">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={signer.name}
                        onChange={(e) => updateSigner(index, 'name', e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={signer.email}
                        onChange={(e) => updateSigner(index, 'email', e.target.value)}
                        className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Role"
                          value={signer.role}
                          onChange={(e) => updateSigner(index, 'role', e.target.value)}
                          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => removeSigner(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addSigner}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Signer
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateRequest(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={createSignatureRequest}
                  disabled={signers.length === 0}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Send Signature Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital Signing Pad Modal */}
      {showSigningPad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Sign Document</h3>
              <button
                onClick={() => setShowSigningPad(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Signature Canvas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Draw Your Signature
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    className="w-full border border-gray-300 rounded cursor-crosshair bg-white"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={clearSignature}
                    className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Legal Notice</p>
                    <p>By signing this document, you agree to be legally bound by its contents. Your signature will be timestamped and recorded with your IP address for verification purposes.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSigningPad(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSignature}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Apply Signature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}