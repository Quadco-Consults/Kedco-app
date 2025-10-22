import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/memos/[id]/comments - Get all comments for a memo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.memoComment.findMany({
      where: { memoId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            signaturePath: true,
            department: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/memos/[id]/comments - Add a comment to a memo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, comment } = body;

    console.log('Received comment request:', { memoId: id, userId, comment: comment?.substring(0, 50) });

    if (!userId || !comment) {
      console.error('Validation failed:', { userId: !!userId, comment: !!comment });
      return NextResponse.json(
        { error: 'userId and comment are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify memo exists
    const memoExists = await prisma.memo.findUnique({
      where: { id },
    });

    if (!memoExists) {
      console.error('Memo not found:', id);
      return NextResponse.json(
        { error: 'Memo not found' },
        { status: 404 }
      );
    }

    const newComment = await prisma.memoComment.create({
      data: {
        memoId: id,
        userId,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            signaturePath: true,
            department: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    console.log('Comment created successfully:', newComment.id);
    return NextResponse.json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to add comment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
