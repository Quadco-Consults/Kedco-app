import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// GET /api/memos/[id]/pdf - Generate PDF for a memo
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch memo with all related data
    const memo = await prisma.memo.findUnique({
      where: { id: params.id },
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
    let yPosition = 20;

    // Header - Company Name
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Kaduna Electric Distribution Company', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('KEDCO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Memo Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MEMORANDUM', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Reference Number and Type
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Reference: ${memo.referenceNumber}`, 20, yPosition);
    doc.text(`Type: ${memo.type.replace(/_/g, ' ')}`, pageWidth - 70, yPosition);
    yPosition += 10;

    // Priority Badge
    const priorityColors: Record<string, [number, number, number]> = {
      URGENT: [220, 38, 38],
      HIGH: [234, 179, 8],
      MEDIUM: [59, 130, 246],
      LOW: [156, 163, 175],
    };
    const priorityColor = priorityColors[memo.priority] || [156, 163, 175];
    doc.setFillColor(...priorityColor);
    doc.roundedRect(20, yPosition - 3, 25, 6, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(memo.priority, 32.5, yPosition + 1, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPosition += 10;

    // Status
    doc.text(`Status: ${memo.status.replace(/_/g, ' ')}`, 20, yPosition);
    yPosition += 10;

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // From/To Section
    doc.setFont('helvetica', 'bold');
    doc.text('FROM:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${memo.createdBy.firstName} ${memo.createdBy.lastName} (${memo.createdBy.department?.name || 'N/A'})`,
      45,
      yPosition
    );
    yPosition += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('DATE:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(memo.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), 45, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('TO:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    const recipients = memo.recipients.map(r =>
      `${r.user.firstName} ${r.user.lastName} (${r.user.department?.name || 'N/A'})`
    ).join(', ');
    const recipientLines = doc.splitTextToSize(recipients, pageWidth - 65);
    doc.text(recipientLines, 45, yPosition);
    yPosition += recipientLines.length * 6 + 8;

    // Separator line
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // Subject
    doc.setFont('helvetica', 'bold');
    doc.text('SUBJECT:', 20, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    const subjectLines = doc.splitTextToSize(memo.subject, pageWidth - 40);
    doc.text(subjectLines, 20, yPosition);
    yPosition += subjectLines.length * 6 + 10;

    // Body
    doc.setFont('helvetica', 'bold');
    doc.text('MESSAGE:', 20, yPosition);
    yPosition += 8;
    doc.setFont('helvetica', 'normal');
    const bodyLines = doc.splitTextToSize(memo.body, pageWidth - 40);

    // Check if we need a new page
    if (yPosition + bodyLines.length * 6 > doc.internal.pageSize.height - 40) {
      doc.addPage();
      yPosition = 20;
    }

    doc.text(bodyLines, 20, yPosition);
    yPosition += bodyLines.length * 6 + 15;

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
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
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

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Comments Section
    if (memo.comments.length > 0) {
      // Check if we need a new page
      if (yPosition + 50 > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('COMMENTS/MINUTES', 20, yPosition);
      yPosition += 10;

      // Create comments table
      const commentsData = memo.comments.map((comment, index) => [
        (index + 1).toString(),
        `${comment.user.firstName} ${comment.user.lastName}`,
        comment.user.role,
        new Date(comment.createdAt).toLocaleDateString(),
        comment.comment,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['#', 'User', 'Role', 'Date', 'Comment']],
        body: commentsData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 90 },
        },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 15;
    }

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | Page ${i} of ${totalPages}`,
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
