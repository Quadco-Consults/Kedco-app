import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get total documents count
    const totalDocuments = await prisma.document.count();

    // Get pending memos count
    const pendingMemos = await prisma.memo.count({
      where: {
        status: 'PENDING_APPROVAL',
      },
    });

    // Get documents in transit
    const inTransitDocuments = await prisma.document.count({
      where: {
        status: 'IN_TRANSIT',
      },
    });

    // Get documents completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = await prisma.document.count({
      where: {
        status: 'ARCHIVED',
        updatedAt: {
          gte: today,
        },
      },
    });

    // Get recent documents
    const recentDocuments = await prisma.document.findMany({
      take: 3,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        currentDepartment: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get recent memos
    const recentMemos = await prisma.memo.findMany({
      take: 3,
      orderBy: {
        updatedAt: 'desc',
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
      },
    });

    const stats = {
      totalDocuments,
      pendingMemos,
      inTransitDocuments,
      completedToday,
      recentDocuments: recentDocuments.map((doc) => ({
        id: doc.id,
        title: doc.title,
        department: doc.currentDepartment?.name || 'N/A',
        status: doc.status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        date: formatTimeAgo(doc.updatedAt),
      })),
      recentMemos: recentMemos.map((memo) => ({
        id: memo.id,
        subject: memo.subject,
        type: memo.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        sender: memo.department?.name || `${memo.createdBy.firstName} ${memo.createdBy.lastName}`,
        date: formatTimeAgo(memo.updatedAt),
        priority: memo.priority,
      })),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
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
