import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.documentComment.deleteMany();
  await prisma.documentMovement.deleteMany();
  await prisma.document.deleteMany();
  await prisma.memoRecipient.deleteMany();
  await prisma.memo.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log('Cleared existing data');

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'MD Office',
        code: 'MD',
        description: 'Managing Director Office',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Finance',
        code: 'FIN',
        description: 'Finance Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Human Resources',
        code: 'HR',
        description: 'Human Resources Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Operations',
        code: 'OPS',
        description: 'Operations Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Internal Audit',
        code: 'IA',
        description: 'Internal Audit Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'IT',
        code: 'IT',
        description: 'Information Technology Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Legal',
        code: 'LEG',
        description: 'Legal Department',
      },
    }),
    prisma.department.create({
      data: {
        name: 'Procurement',
        code: 'PROC',
        description: 'Procurement Department',
      },
    }),
  ]);

  console.log('Created departments');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const mdUser = await prisma.user.create({
    data: {
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

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@kedco.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      departmentId: departments[5].id, // IT
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  });

  const financeHead = await prisma.user.create({
    data: {
      email: 'john.doe@kedco.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'DEPARTMENT_HEAD',
      departmentId: departments[1].id, // Finance
      isActive: true,
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  });

  const hrHead = await prisma.user.create({
    data: {
      email: 'jane.smith@kedco.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'DEPARTMENT_HEAD',
      departmentId: departments[2].id, // HR
      isActive: true,
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  const opsStaff = await prisma.user.create({
    data: {
      email: 'michael.j@kedco.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Johnson',
      role: 'STAFF',
      departmentId: departments[3].id, // Operations
      isActive: true,
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  });

  const auditor = await prisma.user.create({
    data: {
      email: 'sarah.w@kedco.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Williams',
      role: 'AUDITOR',
      departmentId: departments[4].id, // Internal Audit
      isActive: true,
      lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  });

  const legalHead = await prisma.user.create({
    data: {
      email: 'david.brown@kedco.com',
      password: hashedPassword,
      firstName: 'David',
      lastName: 'Brown',
      role: 'DEPARTMENT_HEAD',
      departmentId: departments[6].id, // Legal
      isActive: true,
      lastLogin: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
  });

  const procurementStaff = await prisma.user.create({
    data: {
      email: 'emma.wilson@kedco.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Wilson',
      role: 'STAFF',
      departmentId: departments[7].id, // Procurement
      isActive: true,
      lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
  });

  console.log('Created users');

  // Create Documents
  const doc1 = await prisma.document.create({
    data: {
      referenceNumber: 'DOC-2025-001',
      title: 'Budget Approval Request FY 2025',
      description: 'Annual budget proposal for fiscal year 2025',
      status: 'IN_TRANSIT',
      priority: 'HIGH',
      isExternal: false,
      currentDepartmentId: departments[1].id, // Finance
      createdById: financeHead.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const doc2 = await prisma.document.create({
    data: {
      referenceNumber: 'EXT-DOC-2025-001',
      title: 'Contract Proposal from XYZ Company',
      description: 'External contract proposal for review',
      status: 'UNDER_REVIEW',
      priority: 'URGENT',
      isExternal: true,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      currentDepartmentId: departments[6].id, // Legal
      createdById: adminUser.id,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
  });

  const doc3 = await prisma.document.create({
    data: {
      referenceNumber: 'DOC-2025-002',
      title: 'Staff Training Proposal Q1',
      description: 'Quarterly training program proposal',
      status: 'PENDING',
      priority: 'MEDIUM',
      isExternal: false,
      currentDepartmentId: departments[2].id, // HR
      createdById: hrHead.id,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  const doc4 = await prisma.document.create({
    data: {
      referenceNumber: 'DOC-2025-003',
      title: 'Equipment Procurement Request',
      description: 'Request for new office equipment',
      status: 'RECEIVED',
      priority: 'LOW',
      isExternal: false,
      currentDepartmentId: departments[7].id, // Procurement
      createdById: opsStaff.id,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    },
  });

  const doc5 = await prisma.document.create({
    data: {
      referenceNumber: 'DOC-2025-004',
      title: 'Annual Audit Report 2024',
      description: 'Comprehensive audit report for 2024',
      status: 'ARCHIVED',
      priority: 'HIGH',
      isExternal: false,
      currentDepartmentId: departments[4].id, // Internal Audit
      createdById: auditor.id,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
  });

  console.log('Created documents');

  // Create Document Movements
  await prisma.documentMovement.create({
    data: {
      documentId: doc1.id,
      toDepartment: 'Finance',
      movedById: financeHead.id,
      comments: 'Initial submission',
      movedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.documentMovement.create({
    data: {
      documentId: doc2.id,
      toDepartment: 'External',
      movedById: adminUser.id,
      comments: 'Received from XYZ Company',
      movedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.documentMovement.create({
    data: {
      documentId: doc2.id,
      fromDepartment: 'External',
      toDepartment: 'Legal',
      movedById: legalHead.id,
      comments: 'Forwarded for legal review',
      movedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
  });

  console.log('Created document movements');

  // Create Document Comments (for external document)
  await prisma.documentComment.create({
    data: {
      documentId: doc2.id,
      userId: legalHead.id,
      comment: 'Contract terms look reasonable. Need to verify compliance clauses in section 3.',
    },
  });

  await prisma.documentComment.create({
    data: {
      documentId: doc2.id,
      userId: mdUser.id,
      comment: 'Please ensure all regulatory requirements are met before final approval.',
    },
  });

  console.log('Created document comments');

  // Create Memos
  const memo1 = await prisma.memo.create({
    data: {
      referenceNumber: 'MEM-2025-001',
      subject: 'Annual General Meeting',
      body: 'This is to inform all department heads about the upcoming Annual General Meeting scheduled for next month. Your attendance is mandatory.',
      type: 'INTERNAL',
      priority: 'HIGH',
      status: 'PENDING_APPROVAL',
      departmentId: departments[0].id, // MD Office
      createdById: mdUser.id,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
  });

  const memo2 = await prisma.memo.create({
    data: {
      referenceNumber: 'MEM-2025-002',
      subject: 'Audit Notification for Q4',
      body: 'The Internal Audit Department will be conducting a comprehensive audit of Finance and Operations departments in Q4. Please prepare all relevant documentation.',
      type: 'AUDIT_LETTER',
      priority: 'URGENT',
      status: 'APPROVED',
      departmentId: departments[4].id, // Internal Audit
      createdById: auditor.id,
      approvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
  });

  const memo3 = await prisma.memo.create({
    data: {
      referenceNumber: 'MEM-2025-003',
      subject: 'Budget Approval Request',
      body: 'Requesting approval for the proposed budget allocation for the upcoming fiscal year. Detailed breakdown is attached.',
      type: 'APPROVAL',
      priority: 'HIGH',
      status: 'SENT',
      departmentId: departments[1].id, // Finance
      createdById: financeHead.id,
      approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const memo4 = await prisma.memo.create({
    data: {
      referenceNumber: 'MEM-2025-004',
      subject: 'Response to Regulatory Authority',
      body: 'Draft response to the inquiry from the regulatory authority regarding compliance matters.',
      type: 'EXTERNAL_LETTER',
      priority: 'URGENT',
      status: 'DRAFT',
      departmentId: departments[6].id, // Legal
      createdById: legalHead.id,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
  });

  const memo5 = await prisma.memo.create({
    data: {
      referenceNumber: 'MEM-2025-005',
      subject: 'New IT Security Policy',
      body: 'Circular regarding the implementation of new IT security policies effective immediately. All staff must comply.',
      type: 'CIRCULAR',
      priority: 'MEDIUM',
      status: 'SENT',
      departmentId: departments[5].id, // IT
      createdById: adminUser.id,
      approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    },
  });

  console.log('Created memos');

  // Create Memo Recipients
  await prisma.memoRecipient.createMany({
    data: [
      // Memo 1 recipients (all department heads)
      { memoId: memo1.id, userId: financeHead.id, hasRead: false },
      { memoId: memo1.id, userId: hrHead.id, hasRead: false },
      { memoId: memo1.id, userId: legalHead.id, hasRead: true, readAt: new Date() },

      // Memo 2 recipients
      { memoId: memo2.id, userId: financeHead.id, hasRead: true, readAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      { memoId: memo2.id, userId: opsStaff.id, hasRead: false },

      // Memo 3 recipients
      { memoId: memo3.id, userId: mdUser.id, hasRead: true, readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },

      // Memo 5 recipients (circular - all users)
      { memoId: memo5.id, userId: financeHead.id, hasRead: true, readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { memoId: memo5.id, userId: hrHead.id, hasRead: true, readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { memoId: memo5.id, userId: opsStaff.id, hasRead: false },
      { memoId: memo5.id, userId: auditor.id, hasRead: true, readAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    ],
  });

  console.log('Created memo recipients');

  console.log('Seed completed successfully!');
  console.log('\nTest credentials:');
  console.log('Email: admin@kedco.com | Password: password123');
  console.log('Email: md@kedco.com | Password: password123');
  console.log('Email: john.doe@kedco.com | Password: password123');
  console.log('Email: jane.smith@kedco.com | Password: password123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
