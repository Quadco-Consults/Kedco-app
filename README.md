# KEDCO Registry System

A comprehensive document and memo management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 1. Document Management & Tracking
- **File Movement Tracking**: Track documents as they move between departments
- **Document History**: Complete audit trail showing all movements with timestamps
- **Status Management**: Track document status (Pending, In Transit, Received, Archived)
- **Comments & Minutes**: Add comments and official minutes to documents with timestamps and signatures

### 2. Memo System
Create and manage different types of memos:
- **Approval Memos**: Request approval from MD or department heads
- **External Letters**: Letters requiring MD review and comments before external distribution
- **Audit Letters**: Official audit communications
- **Internal Memos**: Departmental communications
- **Circulars**: Organization-wide announcements

Each memo supports:
- Priority levels (Low, Medium, High, Urgent)
- Multiple recipient departments
- File attachments
- Status tracking (Draft, Pending Approval, Approved, Rejected, Sent)

### 3. Digital Signatures
- Upload signature images or draw signatures directly
- Signatures appear on approved documents and memos
- Secure storage and display

### 4. User Management
- Comprehensive user management with roles:
  - Managing Director (MD)
  - Department Head
  - Staff
  - Administrator
  - Auditor
- Granular permission system with categories:
  - Document permissions (Create, View, Edit, Delete, Approve)
  - Memo permissions (Create, View, Edit, Delete, Approve)
  - User management permissions
  - Department management permissions
- Role-based permission presets
- Custom permission assignment

### 5. Department Management
- Create and manage organizational departments
- Assign department heads
- Track staff count and active documents per department
- Department-based routing for documents and memos

### 6. Dashboard & Analytics
- Overview statistics (Total documents, pending memos, in-transit items)
- Recent activity tracking
- Quick access to pending items
- Visual statistics and trends

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd kedco
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
kedco/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page
│   ├── documents/           # Document management pages
│   ├── memos/               # Memo management pages
│   ├── users/               # User management pages
│   ├── departments/         # Department management pages
│   └── settings/            # User settings pages
├── components/              # React components
│   ├── layout/             # Layout components (Sidebar, Header, etc.)
│   ├── signatures/         # Signature upload component
│   └── ...
├── lib/                     # Utility functions and types
│   ├── types/              # TypeScript type definitions
│   └── ...
└── public/                  # Static assets
```

## Key Components

### TypeScript Types
All data models are fully typed in `lib/types/index.ts`:
- User, UserRole, Permission
- Department
- Document, DocumentMovement, DocumentStatus
- Memo, MemoType, MemoPriority, MemoStatus
- Comment, Approval, Signature
- And more...

### Layout Components
- **Sidebar**: Navigation menu with icons
- **Header**: Search and notifications
- **DashboardLayout**: Main layout wrapper

### Feature Components
- **SignatureUpload**: Upload or draw digital signatures
- Document tracking with timeline view
- Memo creation forms with type selection
- User permissions management interface
- Department management cards

## Mock Data

The application currently uses mock data for demonstration. To integrate with a backend:

1. Replace mock data in pages with API calls
2. Create API routes in `app/api/` directory
3. Implement authentication and authorization
4. Connect to your database

## Future Enhancements

This is the foundation for a full ERP system. Potential additions:
- Email notifications
- Real-time updates with WebSockets
- Advanced reporting and analytics
- Document templates
- Workflow automation
- Mobile app
- Integration with external systems

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npx tsc --noEmit
```

## Contributing

This is a private organizational project. Contact the development team for contribution guidelines.

## License

Proprietary - KEDCO Internal Use Only

## Support

For support, contact the IT department or create an issue in the internal repository.
