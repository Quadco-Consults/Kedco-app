'use client';

import { useState, useRef } from 'react';
import { PencilIcon, ArrowUpTrayIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface SignatureUploadProps {
  currentSignature?: string;
  onSignatureUpdate?: (signature: string) => void;
}

export default function SignatureUpload({
  currentSignature,
  onSignatureUpdate,
}: SignatureUploadProps) {
  const [mode, setMode] = useState<'upload' | 'draw'>('upload');
  const [signature, setSignature] = useState<string | null>(currentSignature || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
    if (onSignatureUpdate) {
      onSignatureUpdate(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSignature(dataUrl);
      if (onSignatureUpdate) {
        onSignatureUpdate(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection */}
      <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowUpTrayIcon className="mx-auto mb-1 h-5 w-5" />
          Upload Image
        </button>
        <button
          onClick={() => setMode('draw')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            mode === 'draw'
              ? 'bg-white text-gray-900 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PencilIcon className="mx-auto mb-1 h-5 w-5" />
          Draw Signature
        </button>
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div>
          <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 transition-colors hover:border-gray-400">
            <ArrowUpTrayIcon className="mb-2 h-8 w-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              Click to upload signature image
            </span>
            <span className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Draw Mode */}
      {mode === 'draw' && (
        <div className="space-y-2">
          <div className="rounded-lg border-2 border-gray-300 bg-white">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full cursor-crosshair"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4" />
              Clear
            </button>
            <button
              onClick={saveDrawnSignature}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <CheckIcon className="h-4 w-4" />
              Save Signature
            </button>
          </div>
        </div>
      )}

      {/* Current Signature Preview */}
      {signature && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Current Signature</p>
            <button
              onClick={() => setSignature(null)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="rounded-lg bg-white p-4">
            <img src={signature} alt="Signature" className="mx-auto max-h-24" />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg bg-green-50 p-3">
        <p className="text-xs text-green-800">
          Your signature will be used to sign documents and memos. Make sure it&apos;s clear and
          professional.
        </p>
      </div>
    </div>
  );
}
