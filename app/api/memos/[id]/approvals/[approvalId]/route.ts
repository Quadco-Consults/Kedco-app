import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/memos/[id]/approvals/[approvalId] - Update approval status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; approvalId: string } }
) {
  try {
    const body = await request.json();
    const { status, comments } = body;

    if (!status || !['APPROVED', 'REJECTED', 'SKIPPED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (APPROVED, REJECTED, SKIPPED)' },
        { status: 400 }
      );
    }

    // Update the approval
    const approval = await prisma.memoApproval.update({
      where: { id: params.approvalId },
      data: {
        status,
        comments,
        approvedAt: status === 'APPROVED' ? new Date() : undefined,
      },
      include: {
        memo: {
          include: {
            approvals: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    // Check if this was a rejection
    if (status === 'REJECTED') {
      await prisma.memo.update({
        where: { id: params.id },
        data: { status: 'REJECTED' },
      });
    } else {
      // Check if all approvals are complete
      const allApprovals = approval.memo.approvals;
      const allApproved = allApprovals.every(
        (a) => a.status === 'APPROVED' || a.status === 'SKIPPED'
      );

      if (allApproved) {
        await prisma.memo.update({
          where: { id: params.id },
          data: {
            status: 'APPROVED',
            approvedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(approval);
  } catch (error) {
    console.error('Error updating approval:', error);
    return NextResponse.json(
      { error: 'Failed to update approval' },
      { status: 500 }
    );
  }
}
