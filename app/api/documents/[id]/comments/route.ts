import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
    const body = await request.json();
    const { comment, type, userId, decision, routeToDepartment, taggedUserId, nextAction, actionDueDate } = body;

    // Validate required fields
    if (!comment || !userId) {
      return NextResponse.json(
        { error: 'Comment and user ID are required' },
        { status: 400 }
      );
    }

    // Verify the document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, departmentId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create the comment with decision information
    let commentText = comment.trim();
    if (type === 'DECISION' && decision) {
      commentText = `[${decision}] ${commentText}`;
      if (routeToDepartment) {
        commentText += ` (Routed to: ${routeToDepartment})`;
      }
    }

    // Add user tagging information to comment text if present
    if (taggedUserId && nextAction) {
      const taggedUserInfo = await prisma.user.findUnique({
        where: { id: taggedUserId },
        select: { firstName: true, lastName: true }
      });
      if (taggedUserInfo) {
        commentText += `\n\n🏷️ Tagged: ${taggedUserInfo.firstName} ${taggedUserInfo.lastName}`;
        commentText += `\n📋 Next Action: ${nextAction}`;
        if (actionDueDate) {
          commentText += `\n📅 Due: ${new Date(actionDueDate).toLocaleDateString()}`;
        }
      }
    }

    const newComment = await prisma.documentComment.create({
      data: {
        documentId,
        userId,
        comment: commentText,
        taggedUserId: taggedUserId || null,
        nextAction: nextAction || null,
        actionDueDate: actionDueDate ? new Date(actionDueDate) : null,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        taggedUser: {
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
    });

    // Handle decision-making and routing
    if (type === 'DECISION') {
      let newStatus = 'UNDER_REVIEW';

      // Update status based on decision
      if (decision === 'APPROVED') {
        newStatus = 'RECEIVED';
      } else if (decision === 'REJECTED') {
        newStatus = 'ARCHIVED';
      } else if (decision === 'REQUIRES_MORE_INFO') {
        newStatus = 'PENDING';
      }

      // Update document status
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date(),
      };

      // If routing to different department, update current department
      if (routeToDepartment) {
        const targetDepartment = await prisma.department.findFirst({
          where: {
            OR: [
              { name: routeToDepartment },
              { code: routeToDepartment },
            ],
          },
        });

        if (targetDepartment) {
          updateData.currentDepartmentId = targetDepartment.id;
          newStatus = 'IN_TRANSIT';
          updateData.status = newStatus;
        }
      }

      await prisma.document.update({
        where: { id: documentId },
        data: updateData,
      });

      // Create a movement record for the decision/routing
      if (routeToDepartment) {
        await prisma.documentMovement.create({
          data: {
            documentId,
            fromDepartment: document.currentDepartmentId || user.departmentId || 'System',
            toDepartment: routeToDepartment,
            movedById: userId,
            comments: `Decision: ${decision} - ${comment.trim()}`,
          },
        });
      }
    }

    // If this is official minutes, update document status
    if (type === 'MINUTES') {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          status: 'UNDER_REVIEW',
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment added successfully',
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;

    const comments = await prisma.documentComment.findMany({
      where: { documentId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        taggedUser: {
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
      orderBy: {
        createdAt: 'desc',
      },
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