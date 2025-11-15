import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Priority, DocumentStatus } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const dueDate = formData.get('dueDate') as string;
    const createdById = formData.get('createdById') as string;
    const recipientsJson = formData.get('recipients') as string;

    console.log('Upload request data:', {
      fileExists: !!file,
      fileName: file?.name,
      title,
      description,
      priority,
      dueDate,
      createdById,
      recipients: recipientsJson
    });

    if (!file || !title || !createdById) {
      return NextResponse.json(
        { error: 'File, title, and creator are required' },
        { status: 400 }
      );
    }

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: createdById },
      select: { id: true, firstName: true, lastName: true }
    });

    if (!user) {
      console.error('User not found:', createdById);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Found user:', user);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const safeFilename = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'documents');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file locally
    const filePath = join(uploadDir, safeFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create file URL for serving
    const fileUrl = `/uploads/documents/${safeFilename}`;

    // Generate reference number
    const count = await prisma.document.count();
    const referenceNumber = `EXT-DOC-2025-${String(count + 1).padStart(3, '0')}`;

    // Parse recipients
    const recipients = recipientsJson ? JSON.parse(recipientsJson) : [];

    // Create document in database
    const document = await prisma.document.create({
      data: {
        referenceNumber,
        title,
        description,
        filePath: fileUrl,
        fileName: originalName,
        fileSize: file.size,
        mimeType: file.type,
        isExternal: true,
        priority: (priority as Priority) || Priority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: DocumentStatus.UNDER_REVIEW,
        createdById,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Create document movement record
    await prisma.documentMovement.create({
      data: {
        documentId: document.id,
        toDepartment: 'External',
        movedById: createdById,
        comments: 'External document uploaded',
      },
    });

    // If recipients are specified, send to them
    if (recipients.length > 0) {
      // Here you could create notifications or assignments for recipients
      // For now, we'll just log it
      console.log('Document will be sent to recipients:', recipients);
    }

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        referenceNumber: document.referenceNumber,
        title: document.title,
        filePath: document.filePath,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
