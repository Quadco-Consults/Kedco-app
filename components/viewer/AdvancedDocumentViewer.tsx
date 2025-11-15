'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ShareIcon,
  XMarkIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  HighlightIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

interface DocumentComment {
  id: string;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  taggedUser?: {
    firstName: string;
    lastName: string;
    email: string;
    department: {
      name: string;
    };
  } | null;
  nextAction?: string;
  actionDueDate?: string;
}

interface AnnotationTool {
  type: 'comment' | 'highlight' | 'draw' | 'text';
  active: boolean;
}

interface Annotation {
  id: string;
  type: 'comment' | 'highlight' | 'draw' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  content: string;
  color: string;
  page: number;
  createdBy: string;
  createdAt: string;
}

interface AdvancedDocumentViewerProps {
  fileUrl: string;
  fileName?: string;
  comments?: DocumentComment[];
  onAddComment?: (pageNumber: number, x: number, y: number) => void;
  onAddAnnotation?: (annotation: Omit<Annotation, 'id' | 'createdAt'>) => void;
  className?: string;
}

export default function AdvancedDocumentViewer({
  fileUrl,
  fileName = 'Document',
  comments = [],
  onAddComment,
  onAddAnnotation,
  className = ''
}: AdvancedDocumentViewerProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeAnnotationTool, setActiveAnnotationTool] = useState<AnnotationTool>({
    type: 'comment',
    active: false
  });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    // Simulate PDF loading and page count detection
    // In a real implementation, you'd use PDF.js or similar
    setTotalPages(5); // Mock value
  }, [fileUrl]);

  const toggleFullScreen = async () => {
    if (!isFullScreen && viewerRef.current) {
      try {
        await viewerRef.current.requestFullscreen();
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    } else if (isFullScreen) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        console.error('Error exiting fullscreen:', error);
      }
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'fit' | number) => {
    if (typeof direction === 'number') {
      setZoom(direction);
    } else {
      switch (direction) {
        case 'in':
          setZoom(prev => Math.min(prev + 25, 300));
          break;
        case 'out':
          setZoom(prev => Math.max(prev - 25, 25));
          break;
        case 'fit':
          setZoom(100);
          break;
      }
    }
  };

  const handlePageChange = (direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentPage(Math.max(1, Math.min(direction, totalPages)));
    } else {
      switch (direction) {
        case 'prev':
          setCurrentPage(prev => Math.max(1, prev - 1));
          break;
        case 'next':
          setCurrentPage(prev => Math.min(totalPages, prev + 1));
          break;
      }
    }
  };

  const handleDocumentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!activeAnnotationTool.active) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    switch (activeAnnotationTool.type) {
      case 'comment':
        onAddComment?.(currentPage, x, y);
        break;
      case 'highlight':
        // Handle highlight annotation
        const highlightAnnotation: Omit<Annotation, 'id' | 'createdAt'> = {
          type: 'highlight',
          x,
          y,
          width: 100,
          height: 20,
          content: 'Highlighted text',
          color: '#FBBF24',
          page: currentPage,
          createdBy: 'current-user'
        };
        onAddAnnotation?.(highlightAnnotation);
        break;
      case 'text':
        // Handle text annotation
        const textAnnotation: Omit<Annotation, 'id' | 'createdAt'> = {
          type: 'text',
          x,
          y,
          content: 'Text note',
          color: '#3B82F6',
          page: currentPage,
          createdBy: 'current-user'
        };
        onAddAnnotation?.(textAnnotation);
        break;
    }
  };

  const handleDrawStart = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeAnnotationTool.type !== 'draw' || !activeAnnotationTool.active) return;

    setIsDrawing(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentPath(`M${x},${y}`);
  };

  const handleDrawMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeAnnotationTool.type !== 'draw') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentPath(prev => `${prev} L${x},${y}`);
  };

  const handleDrawEnd = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    if (currentPath) {
      const drawAnnotation: Omit<Annotation, 'id' | 'createdAt'> = {
        type: 'draw',
        x: 0,
        y: 0,
        content: currentPath,
        color: '#EF4444',
        page: currentPage,
        createdBy: 'current-user'
      };
      onAddAnnotation?.(drawAnnotation);
      setCurrentPath('');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const handlePrint = () => {
    window.open(fileUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileName,
          text: `Check out this document: ${fileName}`,
          url: fileUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy URL to clipboard
      await navigator.clipboard.writeText(fileUrl);
      // You could show a toast notification here
    }
  };

  const annotationTools = [
    { type: 'comment' as const, icon: PencilSquareIcon, label: 'Comment', color: 'text-blue-600' },
    { type: 'highlight' as const, icon: HighlightIcon, label: 'Highlight', color: 'text-yellow-600' },
    { type: 'draw' as const, icon: PaintBrushIcon, label: 'Draw', color: 'text-red-600' },
    { type: 'text' as const, icon: DocumentTextIcon, label: 'Text Note', color: 'text-green-600' }
  ];

  return (
    <div
      ref={viewerRef}
      className={`${isFullScreen ? 'fixed inset-0 z-50 bg-black' : 'relative'} ${className}`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage <= 1}
              className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-green-500 focus:outline-none"
                min="1"
                max={totalPages}
              />
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage >= totalPages}
              className="rounded p-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="mx-4 h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleZoom('out')}
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
            >
              <MagnifyingGlassMinusIcon className="h-5 w-5" />
            </button>
            <select
              value={zoom}
              onChange={(e) => handleZoom(parseInt(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:outline-none"
            >
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={200}>200%</option>
            </select>
            <button
              onClick={() => handleZoom('in')}
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
            >
              <MagnifyingGlassPlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Center - Document Info */}
        <div className="text-center">
          <h3 className="font-medium text-gray-900">{fileName}</h3>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Annotation Tools */}
          <div className="flex items-center gap-1">
            {annotationTools.map((tool) => (
              <button
                key={tool.type}
                onClick={() => setActiveAnnotationTool({
                  type: tool.type,
                  active: activeAnnotationTool.type === tool.type ? !activeAnnotationTool.active : true
                })}
                className={`rounded p-2 ${
                  activeAnnotationTool.type === tool.type && activeAnnotationTool.active
                    ? `bg-gray-100 ${tool.color}`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={tool.label}
              >
                <tool.icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="mx-2 h-6 w-px bg-gray-300" />

          {/* Action Buttons */}
          <button
            onClick={handleDownload}
            className="rounded p-2 text-gray-600 hover:bg-gray-100"
            title="Download"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handlePrint}
            className="rounded p-2 text-gray-600 hover:bg-gray-100"
            title="Print"
          >
            <PrinterIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleShare}
            className="rounded p-2 text-gray-600 hover:bg-gray-100"
            title="Share"
          >
            <ShareIcon className="h-4 w-4" />
          </button>

          <div className="mx-2 h-6 w-px bg-gray-300" />

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullScreen}
            className="rounded p-2 text-gray-600 hover:bg-gray-100"
            title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullScreen ? (
              <ArrowsPointingInIcon className="h-4 w-4" />
            ) : (
              <ArrowsPointingOutIcon className="h-4 w-4" />
            )}
          </button>

          {/* Close (only in fullscreen) */}
          {isFullScreen && (
            <button
              onClick={toggleFullScreen}
              className="rounded p-2 text-gray-600 hover:bg-gray-100"
              title="Close"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <div
            className="relative mx-auto bg-white shadow-lg"
            style={{
              width: `${zoom}%`,
              minHeight: '100%',
              transform: `rotate(${rotation}deg)`
            }}
            onClick={handleDocumentClick}
          >
            {/* PDF/Document Content */}
            <div className="relative">
              <iframe
                src={fileUrl}
                className="h-full w-full"
                style={{ height: '800px' }} // Adjust based on your needs
                title={fileName}
              />

              {/* Drawing Canvas Overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-auto"
                width={800} // Adjust based on document size
                height={800}
                onMouseDown={handleDrawStart}
                onMouseMove={handleDrawMove}
                onMouseUp={handleDrawEnd}
                style={{ display: activeAnnotationTool.type === 'draw' ? 'block' : 'none' }}
              />

              {/* Comment Annotations */}
              {comments.map((comment, index) => {
                // Position comments based on their index or stored coordinates
                const row = Math.floor(index / 2);
                const col = index % 2;
                const x = 120 + (col * 300);
                const y = 80 + (row * 120);

                return (
                  <div
                    key={comment.id}
                    className="absolute pointer-events-auto"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded-r-lg shadow-md max-w-64">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {comment.user.firstName[0]}
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {comment.user.firstName} {comment.user.lastName}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.comment}</p>
                      {comment.nextAction && (
                        <div className="mt-2 p-2 bg-blue-50 rounded border">
                          <p className="text-xs text-blue-600">{comment.nextAction}</p>
                          {comment.actionDueDate && (
                            <p className="text-xs text-blue-500 mt-1">
                              Due: {new Date(comment.actionDueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Other Annotations */}
              {annotations.filter(a => a.page === currentPage).map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${annotation.x}px`,
                    top: `${annotation.y}px`,
                    width: annotation.width ? `${annotation.width}px` : 'auto',
                    height: annotation.height ? `${annotation.height}px` : 'auto'
                  }}
                >
                  {annotation.type === 'highlight' && (
                    <div
                      className="opacity-30"
                      style={{
                        backgroundColor: annotation.color,
                        width: annotation.width,
                        height: annotation.height
                      }}
                    />
                  )}
                  {annotation.type === 'text' && (
                    <div
                      className="bg-white border-2 p-2 rounded shadow-sm text-sm"
                      style={{ borderColor: annotation.color }}
                    >
                      {annotation.content}
                    </div>
                  )}
                  {annotation.type === 'draw' && (
                    <svg className="absolute inset-0 pointer-events-none">
                      <path
                        d={annotation.content}
                        stroke={annotation.color}
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Annotation Panel (if active) */}
        {showAnnotationPanel && (
          <div className="w-80 border-l border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Annotations</h3>
              <button
                onClick={() => setShowAnnotationPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-xs text-white flex items-center justify-center">
                      {comment.user.firstName[0]}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Tool Indicator */}
      {activeAnnotationTool.active && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm">
          {annotationTools.find(t => t.type === activeAnnotationTool.type)?.label} mode active - Click on document to annotate
        </div>
      )}
    </div>
  );
}