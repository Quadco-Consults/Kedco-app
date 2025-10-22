import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/memos/[id]/approvals - Get all approvals for a memo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const approvals = await prisma.memoApproval.findMany({
      where: { memoId: id },
      include: {
        approver: {
          select: {
            id: true,
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
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(approvals);
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

// POST /api/memos/[id]/approvals - Add approvers to a memo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approvers } = body; // Array of { userId: string, order: number }

    if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
      return NextResponse.json(
        { error: 'Approvers array is required' },
        { status: 400 }
      );
    }

    // Create approval records
    const approvalPromises = approvers.map((approver: { userId: string; order: number }) =>
      prisma.memoApproval.create({
        data: {
          memoId: id,
          approverId: approver.userId,
          order: approver.order,
          status: 'PENDING',
        },
      })
    );

    await Promise.all(approvalPromises);

    // Update memo status to PENDING_APPROVAL
    await prisma.memo.update({
      where: { id },
      data: { status: 'PENDING_APPROVAL' },
    });

    return NextResponse.json({ message: 'Approvers added successfully' });
  } catch (error) {
    console.error('Error adding approvers:', error);
    return NextResponse.json(
      { error: 'Failed to add approvers' },
      { status: 500 }
    );
  }
}
