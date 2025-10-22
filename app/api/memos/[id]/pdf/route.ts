import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { readFile } from 'fs/promises';
import path from 'path';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

// GET /api/memos/[id]/pdf - Generate PDF for a memo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Fetch memo with all related data
    const memo = await prisma.memo.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            department: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
        approvals: {
          include: {
            approver: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                department: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                role: true,
                signaturePath: true,
                department: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        recipients: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                department: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!memo) {
      return NextResponse.json(
        { error: 'Memo not found' },
        { status: 404 }
      );
    }

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 25;

    // KEDCO Brand Colors (Green theme) - unused but kept for reference
    // const brandGreen = [22, 163, 74]; // green-600
    // const brandGreenLight = [220, 252, 231]; // green-100
    // const brandGreenDark = [21, 128, 61]; // green-700

    // Add KEDCO Logo on the left
    try {
      const logoPath = path.join(process.cwd(), 'public', 'KEDCO.jpg');
      const logoBuffer = await readFile(logoPath);
      const logoBase64 = logoBuffer.toString('base64');

      const logoWidth = 25;
      const logoHeight = 25;
      doc.addImage(
        `data:image/jpeg;base64,${logoBase64}`,
        'JPEG',
        20,
        15,
        logoWidth,
        logoHeight
      );
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }

    // Company name centered at top
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('KANO ELECTRICITY DISTRIBUTION COMPANY', pageWidth / 2, 20, { align: 'center' });

    // "INTERNAL MEMO" centered below with underline
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('INTERNAL MEMO', pageWidth / 2, 28, { align: 'center' });

    // Underline for "INTERNAL MEMO"
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    const memoTextWidth = doc.getTextWidth('INTERNAL MEMO');
    doc.line((pageWidth - memoTextWidth) / 2, 29, (pageWidth + memoTextWidth) / 2, 29);

    yPosition = 45;

    // Date on the right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(memo.createdAt).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })}`, pageWidth - 20, yPosition, { align: 'right' });

    yPosition += 10;

    // Simple field layout
    const leftMargin = 20;
    const labelWidth = 20;
    doc.setFontSize(10);

    // TO section
    doc.setFont('helvetica', 'bold');
    doc.text('To:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    const toText = memo.recipients.map(r =>
      `${r.user.firstName} ${r.user.lastName} (${r.user.role})`
    ).join(', ');
    const toLines = doc.splitTextToSize(toText, pageWidth - 50);
    doc.text(toLines, leftMargin + labelWidth, yPosition);
    yPosition += Math.max(toLines.length * 5, 8);

    // FROM section
    doc.setFont('helvetica', 'bold');
    doc.text('From:', leftMargin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${memo.createdBy.firstName} ${memo.createdBy.lastName} (${memo.createdBy.role})`,
      leftMargin + labelWidth,
      yPosition
    );
    yPosition += 8;

    // Subject with underline
    doc.setFont('helvetica', 'bold');
    doc.text('Subject:', leftMargin, yPosition);
    doc.setFont('helvetica', 'bold');
    const subjectText = memo.subject.toUpperCase();
    const subjectLines = doc.splitTextToSize(subjectText, pageWidth - 50);
    doc.text(subjectLines, leftMargin + labelWidth, yPosition);
    yPosition += Math.max(subjectLines.length * 5, 5);

    // Underline under subject
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(leftMargin, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Body/Message Content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const bodyLines = doc.splitTextToSize(memo.body, pageWidth - 40);

    // Check if we need a new page
    if (yPosition + bodyLines.length * 5 > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(bodyLines, leftMargin, yPosition);
    yPosition += bodyLines.length * 5 + 10;

    // Approvals Section
    if (memo.approvals.length > 0) {
      // Check if we need a new page
      if (yPosition + 50 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('APPROVAL WORKFLOW', 20, yPosition);
      yPosition += 10;

      // Create approval table
      const approvalData = memo.approvals.map((approval, index) => [
        (index + 1).toString(),
        `${approval.approver.firstName} ${approval.approver.lastName}`,
        approval.approver.role,
        approval.approver.department?.name || 'N/A',
        approval.status,
        approval.approvedAt ? new Date(approval.approvedAt).toLocaleDateString() : '-',
        approval.comments || '-',
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Approver', 'Role', 'Department', 'Status', 'Date', 'Comments']],
        body: approvalData,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] as [number, number, number], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 45 },
        },
      });

      yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
    }

    // Comments/Minutes Section
    if (memo.comments.length > 0) {
      // Add some spacing before comments
      yPosition += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('COMMENTS/MINUTES', leftMargin, yPosition);
      yPosition += 8;

      // Display comments side by side (2 columns)
      const displayComments = memo.comments.slice(0, 4); // Show max 4 comments (2x2 grid)
      const columnWidth = (pageWidth - 40) / 2; // Two columns
      const column1X = leftMargin;
      const column2X = leftMargin + columnWidth + 5;

      let currentColumn = 0;
      let maxYInRow = yPosition;

      for (let i = 0; i < displayComments.length; i++) {
        const comment = displayComments[i];
        const columnX = currentColumn === 0 ? column1X : column2X;
        let commentY = yPosition;

        // Layout: Name & Role | Comment | Signature (all side by side)

        // Left section: Name and Role (20% of column width)
        const leftSectionWidth = columnWidth * 0.25;
        const commentSectionWidth = columnWidth * 0.50;
        const signatureSectionWidth = columnWidth * 0.25;

        // Name (bold, compact)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        const nameText = `${comment.user.firstName} ${comment.user.lastName}`;
        const nameLines = doc.splitTextToSize(nameText, leftSectionWidth - 2);
        doc.text(nameLines, columnX, commentY);

        // Role below name (compact)
        const roleY = commentY + nameLines.length * 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        const roleText = comment.user.role.replace(/_/g, ' ');
        const roleLines = doc.splitTextToSize(roleText, leftSectionWidth - 2);
        doc.text(roleLines, columnX, roleY);

        // Date below role
        const dateY = roleY + roleLines.length * 3.5;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(6);
        const dateStr = new Date(comment.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: '2-digit'
        });
        doc.text(dateStr, columnX, dateY);

        // Middle section: Comment text
        const commentX = columnX + leftSectionWidth;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(50, 50, 50);

        let commentText = comment.comment;
        if (commentText.length > 80) {
          commentText = commentText.substring(0, 80) + '...';
        }
        const commentLines = doc.splitTextToSize(commentText, commentSectionWidth - 2);
        const displayLines = commentLines.slice(0, 3); // Max 3 lines
        doc.text(displayLines, commentX, commentY);

        // Right section: Signature
        const signatureX = columnX + leftSectionWidth + commentSectionWidth;
        if (comment.user.signaturePath) {
          try {
            let signatureBuffer: Buffer;

            // Check if signature is a URL (Vercel Blob) or local path
            if (comment.user.signaturePath.startsWith('http')) {
              // Fetch from URL (Vercel Blob Storage)
              const response = await fetch(comment.user.signaturePath);
              const arrayBuffer = await response.arrayBuffer();
              signatureBuffer = Buffer.from(arrayBuffer);
            } else {
              // Read from local filesystem (legacy)
              const signaturePath = path.join(process.cwd(), 'public', comment.user.signaturePath);
              signatureBuffer = await readFile(signaturePath);
            }

            const signatureBase64 = signatureBuffer.toString('base64');
            const signatureExt = comment.user.signaturePath.split('.').pop()?.toLowerCase();

            let imageType = 'PNG';
            if (signatureExt === 'jpg' || signatureExt === 'jpeg') {
              imageType = 'JPEG';
            } else if (signatureExt === 'svg') {
              imageType = 'SVG';
            }

            const signatureWidth = signatureSectionWidth - 2;
            const signatureHeight = 10;

            doc.addImage(
              `data:image/${signatureExt};base64,${signatureBase64}`,
              imageType,
              signatureX,
              commentY - 2,
              signatureWidth,
              signatureHeight
            );
          } catch (error) {
            console.error('Error adding signature to PDF:', error);
          }
        }

        // Calculate height for this comment block
        const blockHeight = Math.max(
          dateY - commentY + 4, // Height of left section
          displayLines.length * 4, // Height of comment
          12 // Minimum height for signature
        );

        commentY += blockHeight + 8; // Add spacing between comments
        maxYInRow = Math.max(maxYInRow, commentY);

        // Move to next column or next row
        if (currentColumn === 0) {
          currentColumn = 1;
        } else {
          currentColumn = 0;
          yPosition = maxYInRow; // Move to next row
          maxYInRow = yPosition;
        }
      }

      // Adjust yPosition if we ended on first column
      if (currentColumn === 1) {
        yPosition = maxYInRow;
      }

      // If there are more comments, add indicator
      if (memo.comments.length > 4) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`+ ${memo.comments.length - 4} more comment(s)...`, leftMargin, yPosition + 2);
      }
    }

    // Footer with page number
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(
        `${i}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="memo-${memo.referenceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
