import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: any = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { referenceNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    const memos = await prisma.memo.findMany({
      where,
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the frontend format
    const transformedMemos = memos.map((memo) => ({
      id: memo.id,
      referenceNumber: memo.referenceNumber,
      subject: memo.subject,
      body: memo.body,
      type: memo.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      typeRaw: memo.type,
      priority: memo.priority,
      status: memo.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      statusRaw: memo.status,
      recipientDepartment: memo.recipients
        .map((r) => r.user.department?.name)
        .filter((name, index, self) => name && self.indexOf(name) === index)
        .join(', ') || 'All Departments',
      createdBy: memo.department?.name || `${memo.createdBy.firstName} ${memo.createdBy.lastName}`,
      createdAt: memo.createdAt.toISOString().split('T')[0],
      updatedAt: formatTimeAgo(memo.updatedAt),
    }));

    return NextResponse.json(transformedMemos);
  } catch (error) {
    console.error('Error fetching memos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subject,
      memoBody,
      type,
      priority,
      departmentId,
      createdById,
      recipients,
    } = body;

    if (!subject || !memoBody || !type || !createdById) {
      return NextResponse.json(
        { error: 'Subject, body, type, and creator are required' },
        { status: 400 }
      );
    }

    // Generate reference number
    const count = await prisma.memo.count();
    const referenceNumber = `MEM-2025-${String(count + 1).padStart(3, '0')}`;

    const memo = await prisma.memo.create({
      data: {
        referenceNumber,
        subject,
        body: memoBody,
        type,
        priority: priority || 'MEDIUM',
        status: 'DRAFT',
        departmentId,
        createdById,
        recipients: recipients
          ? {
              create: recipients.map((userId: string) => ({
                userId,
              })),
            }
          : undefined,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        department: {
          select: {
            name: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(memo, { status: 201 });
  } catch (error) {
    console.error('Error creating memo:', error);
    return NextResponse.json(
      { error: 'Failed to create memo' },
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
