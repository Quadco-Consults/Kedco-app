import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const file = formData.get('signature') as File;

    if (!userId || !file) {
      return NextResponse.json(
        { error: 'User ID and signature file are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, JPEG, and SVG are allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `signatures/signature_${userId}_${timestamp}.${extension}`;

    // Upload to Vercel Blob Storage
    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Update user signature path in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        signaturePath: blob.url,
      },
      select: {
        id: true,
        signaturePath: true,
      },
    });

    return NextResponse.json({
      message: 'Signature uploaded successfully',
      signaturePath: user.signaturePath,
    });
  } catch (error) {
    console.error('Error uploading signature:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload signature',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove signature path from database
    await prisma.user.update({
      where: { id: userId },
      data: {
        signaturePath: null,
      },
    });

    return NextResponse.json({ message: 'Signature removed successfully' });
  } catch (error) {
    console.error('Error removing signature:', error);
    return NextResponse.json(
      { error: 'Failed to remove signature' },
      { status: 500 }
    );
  }
}
