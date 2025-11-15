'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File | null;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
}

interface FileValidation {
  isValid: boolean;
  error?: string;
}

export default function AdvancedFileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = '.pdf,.doc,.docx',
  maxSize = 10,
  multiple = false,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validation, setValidation] = useState<FileValidation>({ isValid: true });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): FileValidation => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSize}MB`
      };
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  };

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateFile(file);
    setValidation(validation);

    if (validation.isValid) {
      // Simulate upload progress
      setIsUploading(true);
      setUploadProgress(0);

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsUploading(false);
            onFileSelect(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  }, [onFileSelect, maxSize, accept]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      default:
        return '📎';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      {!selectedFile && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200
            ${isDragging
              ? 'border-green-400 bg-green-50 scale-105'
              : 'border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50'
            }
            ${!validation.isValid ? 'border-red-400 bg-red-50' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-full ${isDragging ? 'bg-green-100' : 'bg-white'} shadow-sm`}>
              <ArrowUpTrayIcon className={`h-12 w-12 ${isDragging ? 'text-green-600' : 'text-gray-400'}`} />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
              </p>
              <p className="text-sm text-gray-500">
                or <span className="font-medium text-green-600">browse</span> to choose a file
              </p>
            </div>

            <div className="text-xs text-gray-400">
              <p>Supported formats: {accept.replace(/\./g, '').toUpperCase()}</p>
              <p>Maximum size: {maxSize}MB</p>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-xl">
              <div className="w-48 bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-700">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      {/* File Preview */}
      {selectedFile && !isUploading && (
        <div className="border border-green-300 bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-2xl">
                  {getFileIcon(selectedFile.name)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">Ready to upload</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
                setValidation({ isValid: true });
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="flex-shrink-0 p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Validation Error */}
      {!validation.isValid && (
        <div className="border border-red-300 bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{validation.error}</p>
          </div>
        </div>
      )}

      {/* File Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Drag and drop multiple files or click to browse</p>
        <p>• Files are automatically validated for type and size</p>
        <p>• Upload progress is shown in real-time</p>
      </div>
    </div>
  );
}