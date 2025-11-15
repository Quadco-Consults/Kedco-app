'use client';

import { useState, useEffect } from 'react';
import { DocumentComment } from '@prisma/client';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';

interface PDFComment extends DocumentComment {
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
}

interface PDFViewerWithCommentsProps {
  fileUrl: string;
  comments: PDFComment[];
  onAddComment?: (pageNumber: number, x: number, y: number) => void;
  className?: string;
}

export default function PDFViewerWithComments({
  fileUrl,
  comments,
  onAddComment,
  className = ''
}: PDFViewerWithCommentsProps) {
  const [selectedComment, setSelectedComment] = useState<PDFComment | null>(null);

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        /* Ensure comment overlays are visible when printing */
        .print-comment-overlay {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Hide interactive elements when printing */
        .no-print {
          display: none !important;
        }

        /* Ensure comments are positioned correctly for print */
        .print-comment {
          position: absolute !important;
          background: yellow !important;
          border: 2px solid #fbbf24 !important;
          border-radius: 8px !important;
          padding: 8px !important;
          font-size: 12px !important;
          max-width: 200px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
          z-index: 1000 !important;
        }

        /* Make sure the PDF container maintains position for print */
        .pdf-container {
          position: relative !important;
        }

        /* Hide modals and tooltips when printing */
        .fixed {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleIframeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onAddComment) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      onAddComment(1, x, y); // Default to page 1 for now
    }
  };

  const openPrintableVersion = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    // Create HTML for printable version
    const commentsHtml = comments.map((comment, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = 120 + (col * 300);
      const y = 80 + (row * 120);

      let cleanComment = comment.comment.replace(/^\[.*?\]\s*/, '');
      cleanComment = cleanComment.split('\n\n🏷️')[0];
      cleanComment = cleanComment.trim();
      const displayText = cleanComment.length > 50 ? cleanComment.substring(0, 50) + '...' : cleanComment;

      return `
        <div style="position: absolute; left: ${x}px; top: ${y}px; max-width: 250px; background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 24px; height: 24px; background: #3b82f6; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
              ${comment.user.firstName[0]}
            </div>
            <span style="font-size: 12px; font-weight: 500; color: #374151;">
              ${comment.user.firstName} ${comment.user.lastName}
            </span>
          </div>
          <p style="font-size: 14px; color: #1f2937; margin: 8px 0; font-style: italic;">
            "${displayText}"
          </p>
          <p style="font-size: 11px; color: #6b7280; margin: 8px 0 0 0;">
            ${new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Document with Comments</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .pdf-container { position: relative; width: 100%; height: 100vh; }
            iframe { width: 100%; height: 100%; border: none; }
            @media print {
              body { margin: 0; }
              .comment-overlay { position: absolute !important; }
              * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            <iframe src="${fileUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
            <div class="comment-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
              ${commentsHtml}
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">PDF Viewer with Comments</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openPrintableVersion()}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            🖨️ Print with Comments
          </button>
          <span className="text-sm text-gray-600">
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* PDF Viewer with Comment Overlay */}
      <div className="relative bg-gray-100 pdf-container print-comment-overlay" style={{ height: '600px' }}>
        {/* PDF Iframe */}
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title="PDF Document"
        />

        {/* Comment Text Overlays - Like Pen Annotations */}
        <div className="absolute inset-0 pointer-events-none">
          {comments.map((comment, index) => {
            // Position annotations in a staggered pattern across the document
            const row = Math.floor(index / 2);
            const col = index % 2;
            const x = 120 + (col * 300); // Wider horizontal spacing for text
            const y = 80 + (row * 120);   // More vertical spacing for text

            // Extract clean comment text (remove decision tags and user info)
            let cleanComment = comment.comment.replace(/^\[.*?\]\s*/, ''); // Remove [APPROVED], etc.
            cleanComment = cleanComment.split('\n\n🏷️')[0]; // Remove tagged user info
            cleanComment = cleanComment.trim();

            // Limit comment length for overlay display
            const displayText = cleanComment.length > 50 ? cleanComment.substring(0, 50) + '...' : cleanComment;

            return (
              <div
                key={comment.id}
                className="absolute pointer-events-auto group"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  maxWidth: '250px'
                }}
              >
                {/* Comment Text Box - Styled like handwritten note */}
                <div
                  className="bg-yellow-100 border-l-4 border-yellow-400 p-3 rounded-r-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform duration-200 cursor-pointer print-comment print-comment-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComment(selectedComment?.id === comment.id ? null : comment);
                  }}
                >
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {comment.user.firstName[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-gray-800 font-handwriting" style={{ fontFamily: 'cursive' }}>
                    "{displayText}"
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>

                  {/* Show if there's more content */}
                  {(comment.taggedUserId || comment.nextAction || cleanComment.length > 50) && (
                    <div className="mt-2 text-xs text-blue-600 font-medium no-print">
                      Click for details...
                    </div>
                  )}
                </div>

                {/* Detailed Modal - Shows on Click */}
                {selectedComment?.id === comment.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-auto">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {comment.user.firstName[0]}{comment.user.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {comment.user.firstName} {comment.user.lastName}
                            </h4>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {comment.user.role}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                            {comment.comment}
                          </p>

                          {/* Show tagged user and next action if present */}
                          {comment.taggedUserId && comment.nextAction && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border">
                              <p className="text-xs font-medium text-blue-700 mb-1">📋 Action Required:</p>
                              <p className="text-xs text-blue-600">{comment.nextAction}</p>
                              {comment.actionDueDate && (
                                <p className="text-xs text-blue-500 mt-1">
                                  📅 Due: {new Date(comment.actionDueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Close button */}
                      <button
                        onClick={() => setSelectedComment(null)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comments Summary */}
      {comments.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 p-3 no-print">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Click the note-style annotations above to view full comment details
            </p>
            <span className="text-xs text-gray-500">
              {comments.length} annotation{comments.length !== 1 ? 's' : ''} total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}