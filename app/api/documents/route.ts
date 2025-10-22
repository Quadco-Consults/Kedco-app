import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma, DocumentStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const where: Prisma.DocumentWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { referenceNumber: { contains: search } },
      ];
    }

    if (status && status !== 'All') {
      where.status = status as DocumentStatus;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        currentDepartment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend format
    const transformedDocuments = documents.map((doc) => ({
      id: doc.id,
      referenceNumber: doc.referenceNumber,
      title: doc.title,
      description: doc.description,
      currentDepartment: doc.isExternal ? 'External' : (doc.currentDepartment?.name || 'N/A'),
      status: doc.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      priority: doc.priority,
      isExternal: doc.isExternal,
      createdBy: `${doc.createdBy.firstName} ${doc.createdBy.lastName}`,
      createdAt: doc.createdAt.toISOString().split('T')[0],
      updatedAt: formatTimeAgo(doc.updatedAt),
    }));

    return NextResponse.json(transformedDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      isExternal,
      priority,
      dueDate,
      currentDepartmentId,
      createdById,
    } = body;

    if (!title || !createdById) {
      return NextResponse.json(
        { error: 'Title and creator are required' },
        { status: 400 }
      );
    }

    // Generate reference number
    const count = await prisma.document.count();
    const referenceNumber = isExternal
      ? `EXT-DOC-2025-${String(count + 1).padStart(3, '0')}`
      : `DOC-2025-${String(count + 1).padStart(3, '0')}`;

    const document = await prisma.document.create({
      data: {
        referenceNumber,
        title,
        description,
        isExternal: isExternal || false,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        currentDepartmentId,
        createdById,
        status: 'PENDING',
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        currentDepartment: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
}
