import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const memo = await prisma.memo.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
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

    return NextResponse.json(memo);
  } catch (error) {
    console.error('Error fetching memo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const memo = await prisma.memo.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(memo);
  } catch (error) {
    console.error('Error updating memo:', error);
    return NextResponse.json(
      { error: 'Failed to update memo' },
      { status: 500 }
    );
  }
}
