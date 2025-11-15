import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
    const body = await request.json();
    const { toDepartment, notes, movedById } = body;

    // Validate required fields
    if (!toDepartment || !movedById) {
      return NextResponse.json(
        { error: 'Department and user ID are required' },
        { status: 400 }
      );
    }

    // Get the document to check current department
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        currentDepartment: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Get the target department
    const targetDepartment = await prisma.department.findFirst({
      where: {
        OR: [
          { name: toDepartment },
          { code: toDepartment },
        ],
      },
    });

    if (!targetDepartment) {
      return NextResponse.json(
        { error: 'Target department not found' },
        { status: 404 }
      );
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: movedById },
      include: { department: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the document's current department and status
    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        currentDepartmentId: targetDepartment.id,
        status: 'IN_TRANSIT',
        updatedAt: new Date(),
      },
    });

    // Create a movement record
    const movement = await prisma.documentMovement.create({
      data: {
        documentId,
        fromDepartment: document.currentDepartment?.name || 'System',
        toDepartment: targetDepartment.name,
        movedById,
        comments: notes || `Routed to ${targetDepartment.name}`,
      },
      include: {
        movedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create a routing comment if notes were provided
    if (notes) {
      await prisma.documentComment.create({
        data: {
          documentId,
          userId: movedById,
          comment: `Document routed to ${targetDepartment.name}: ${notes}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      movement,
      message: `Document successfully routed to ${targetDepartment.name}`,
    });
  } catch (error) {
    console.error('Error transferring document:', error);
    return NextResponse.json(
      { error: 'Failed to transfer document' },
      { status: 500 }
    );
  }
}