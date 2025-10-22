import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

// This is a one-time setup endpoint to seed the production database
// After running once, you should disable or delete this endpoint
export async function POST() {
  try {
    // Check if departments already exist
    const existingDepartments = await prisma.department.count();

    if (existingDepartments > 0) {
      return NextResponse.json(
        { message: 'Database already seeded. Departments exist.', departmentCount: existingDepartments },
        { status: 200 }
      );
    }

    // Create Departments
    const departments = await Promise.all([
      prisma.department.create({
        data: { name: 'MD Office', code: 'MD', description: 'Managing Director Office' },
      }),
      prisma.department.create({
        data: { name: 'Finance', code: 'FIN', description: 'Finance Department' },
      }),
      prisma.department.create({
        data: { name: 'Human Resources', code: 'HR', description: 'Human Resources Department' },
      }),
      prisma.department.create({
        data: { name: 'Operations', code: 'OPS', description: 'Operations Department' },
      }),
      prisma.department.create({
        data: { name: 'Internal Audit', code: 'IA', description: 'Internal Audit Department' },
      }),
      prisma.department.create({
        data: { name: 'IT', code: 'IT', description: 'Information Technology Department' },
      }),
      prisma.department.create({
        data: { name: 'Legal', code: 'LEG', description: 'Legal Department' },
      }),
      prisma.department.create({
        data: { name: 'Procurement', code: 'PROC', description: 'Procurement Department' },
      }),
    ]);

    // Create Users (use upsert to avoid conflicts if users already exist)
    const hashedPassword = await bcrypt.hash('password123', 10);

    await prisma.user.upsert({
      where: { email: 'md@kedco.com' },
      update: { departmentId: departments[0].id },
      create: {
        email: 'md@kedco.com',
        password: hashedPassword,
        firstName: 'Managing',
        lastName: 'Director',
        role: 'MD',
        departmentId: departments[0].id,
        isActive: true,
        lastLogin: new Date(),
      },
    });

    await prisma.user.upsert({
      where: { email: 'admin@kedco.com' },
      update: { departmentId: departments[5].id },
      create: {
        email: 'admin@kedco.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        departmentId: departments[5].id, // IT
        isActive: true,
        lastLogin: new Date(),
      },
    });

    await prisma.user.upsert({
      where: { email: 'john.doe@kedco.com' },
      update: { departmentId: departments[1].id },
      create: {
        email: 'john.doe@kedco.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'DEPARTMENT_HEAD',
        departmentId: departments[1].id, // Finance
        isActive: true,
      },
    });

    await prisma.user.upsert({
      where: { email: 'jane.smith@kedco.com' },
      update: { departmentId: departments[2].id },
      create: {
        email: 'jane.smith@kedco.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'DEPARTMENT_HEAD',
        departmentId: departments[2].id, // HR
        isActive: true,
      },
    });

    return NextResponse.json({
      message: 'Database seeded successfully!',
      credentials: {
        admin: { email: 'admin@kedco.com', password: 'password123' },
        md: { email: 'md@kedco.com', password: 'password123' },
        financeHead: { email: 'john.doe@kedco.com', password: 'password123' },
        hrHead: { email: 'jane.smith@kedco.com', password: 'password123' },
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database', details: String(error) },
      { status: 500 }
    );
  }
}
