// User and Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  departmentId: string;
  role: UserRole;
  permissions: Permission[];
  signature?: string; // Base64 or URL to signature image
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export enum UserRole {
  MD = 'MD',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
}

export enum Permission {
  // Document permissions
  CREATE_DOCUMENT = 'CREATE_DOCUMENT',
  VIEW_DOCUMENT = 'VIEW_DOCUMENT',
  EDIT_DOCUMENT = 'EDIT_DOCUMENT',
  DELETE_DOCUMENT = 'DELETE_DOCUMENT',
  APPROVE_DOCUMENT = 'APPROVE_DOCUMENT',

  // Memo permissions
  CREATE_MEMO = 'CREATE_MEMO',
  VIEW_MEMO = 'VIEW_MEMO',
  EDIT_MEMO = 'EDIT_MEMO',
  DELETE_MEMO = 'DELETE_MEMO',
  APPROVE_MEMO = 'APPROVE_MEMO',

  // User management
  CREATE_USER = 'CREATE_USER',
  VIEW_USER = 'VIEW_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Department management
  CREATE_DEPARTMENT = 'CREATE_DEPARTMENT',
  VIEW_DEPARTMENT = 'VIEW_DEPARTMENT',
  EDIT_DEPARTMENT = 'EDIT_DEPARTMENT',
  DELETE_DEPARTMENT = 'DELETE_DEPARTMENT',
}

// Department Types
export interface Department {
  id: string;
  name: string;
  code: string;
  headId: string; // User ID of department head
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Document Types
export interface Document {
  id: string;
  referenceNumber: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  createdBy: string; // User ID
  currentDepartmentId: string;
  status: DocumentStatus;
  movements: DocumentMovement[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  // External document fields
  isExternal?: boolean;
  priority?: MemoPriority; // Reuse MemoPriority enum
  dueDate?: Date;
  recipients?: DocumentRecipient[];
}

export interface DocumentRecipient {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientTitle: string;
  recipientDepartment: string;
  hasReviewed: boolean;
  reviewedAt?: Date;
  comment?: string;
  signature?: string;
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  ARCHIVED = 'ARCHIVED',
}

export interface DocumentMovement {
  id: string;
  documentId: string;
  fromDepartmentId: string;
  toDepartmentId: string;
  sentBy: string; // User ID
  receivedBy?: string; // User ID
  sentAt: Date;
  receivedAt?: Date;
  notes?: string;
  status: MovementStatus;
}

export enum MovementStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  REJECTED = 'REJECTED',
}

// Memo Types
export interface Memo {
  id: string;
  referenceNumber: string;
  type: MemoType;
  subject: string;
  content: string;
  priority: MemoPriority;
  createdBy: string; // User ID
  recipientIds: string[]; // User IDs
  recipientDepartmentIds: string[]; // Department IDs
  status: MemoStatus;
  attachments: Attachment[];
  comments: Comment[];
  approvals: Approval[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export enum MemoType {
  APPROVAL = 'APPROVAL',
  EXTERNAL_LETTER = 'EXTERNAL_LETTER',
  AUDIT_LETTER = 'AUDIT_LETTER',
  INTERNAL = 'INTERNAL',
  CIRCULAR = 'CIRCULAR',
}

export enum MemoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MemoStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SENT = 'SENT',
  ARCHIVED = 'ARCHIVED',
}

// Comment/Minutes Types
export interface Comment {
  id: string;
  entityType: 'DOCUMENT' | 'MEMO';
  entityId: string; // Document or Memo ID
  userId: string;
  content: string;
  signature?: string; // Base64 or URL to signature
  createdAt: Date;
  updatedAt: Date;
  isMinute: boolean; // If true, this is official minutes
}

// Approval Types
export interface Approval {
  id: string;
  memoId: string;
  approverId: string; // User ID
  status: ApprovalStatus;
  comments?: string;
  signature?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Attachment Types
export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
}

// Signature Types
export interface Signature {
  id: string;
  userId: string;
  imageData: string; // Base64 encoded image
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Query Types
export interface DocumentFilter {
  status?: DocumentStatus;
  departmentId?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface MemoFilter {
  type?: MemoType;
  status?: MemoStatus;
  priority?: MemoPriority;
  recipientId?: string;
  departmentId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
