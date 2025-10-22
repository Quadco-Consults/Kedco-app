# Digital Signature Implementation Guide

## Overview
The KEDCO memo system now supports digital signatures that are automatically embedded in PDF documents when users add comments or minutes.

## How It Works

### 1. **Setting Up Your Signature**
- Navigate to **Settings** → **Digital Signature** tab
- You have two options:
  - **Upload a signature image** (PNG, JPG, JPEG, SVG)
  - **Draw your signature** using the signature pad
- Click **Save Signature** to store it

### 2. **Signature Storage**
- Signatures are stored in: `/public/uploads/signatures/`
- Format: `signature_{userId}_{timestamp}.{ext}`
- Database field: `User.signaturePath` contains the public path
- Example: `/uploads/signatures/signature_123_1234567890.png`

### 3. **Automatic Signature Integration**

#### When Adding Comments:
1. User adds a comment on a memo detail page
2. Comment is saved with `userId` and `comment` text
3. System automatically retrieves the user's signature from the database

#### In PDF Generation:
1. When PDF is generated, the system:
   - Fetches all comments with user details and signatures
   - Reads signature image files from disk
   - Converts to base64 for embedding in PDF
   - Places signature above the user's name in each comment block

### 4. **PDF Display Format**

```
┌────────────────────────────────────────────┐
│ Comment text goes here...                  │
│ This can be multiple lines...              │
├────────────────────────────────────────────┤
│ [Signature Image]                          │
│ John Doe                        27/04/23   │
│ DEPARTMENT_HEAD - Finance                  │
└────────────────────────────────────────────┘
```

## Technical Implementation

### Database Schema
```prisma
model User {
  signaturePath String?  // Path to signature image in public folder
  // ... other fields
}

model MemoComment {
  user User  // Relation includes signaturePath
  // ... other fields
}
```

### API Endpoints

#### Upload Signature
- **POST** `/api/users/signature`
- Body: `FormData` with `userId` and `signature` file
- Saves file to `/public/uploads/signatures/`
- Updates `User.signaturePath` in database

#### Delete Signature
- **DELETE** `/api/users/signature?userId={id}`
- Removes `signaturePath` from database
- Note: Physical file remains (for audit purposes)

#### Get Comments (with signatures)
- **GET** `/api/memos/[id]/comments`
- Returns: Comments with user details including `signaturePath`

#### Generate PDF (with signatures)
- **GET** `/api/memos/[id]/pdf`
- Reads signature files from disk
- Embeds signatures in PDF document
- Format: base64-encoded images

### Frontend Components

#### SignatureUpload Component
- Location: `/components/signatures/SignatureUpload.tsx`
- Features:
  - File upload
  - Draw signature pad
  - Preview current signature
  - Remove signature

#### Settings Page
- Location: `/app/settings/page.tsx`
- Handles signature upload/removal
- Displays current signature

#### Memo Detail Page
- Location: `/app/memos/[id]/page.tsx`
- Comments section automatically includes signatures
- PDF preview/download buttons

## File Structure

```
kedco/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   └── signature/
│   │   │       └── route.ts          # Upload/Delete signatures
│   │   └── memos/
│   │       └── [id]/
│   │           ├── comments/
│   │           │   └── route.ts      # Get/Post comments
│   │           └── pdf/
│   │               └── route.ts      # Generate PDF with signatures
│   ├── settings/
│   │   └── page.tsx                  # Signature management UI
│   └── memos/
│       └── [id]/
│           └── page.tsx              # Comment/PDF preview
├── components/
│   └── signatures/
│       └── SignatureUpload.tsx       # Signature upload component
├── public/
│   └── uploads/
│       └── signatures/               # Stored signature files
│           └── signature_*.{png,jpg}
└── prisma/
    └── schema.prisma                 # User.signaturePath field
```

## Usage Flow

### For Users:
1. Go to Settings → Digital Signature
2. Upload or draw your signature
3. Add comments on memos as usual
4. Your signature automatically appears in PDFs

### For Admins:
- Signatures are automatically managed
- Files are stored securely in `/public/uploads/signatures/`
- Database maintains relationships
- No manual intervention needed

## Security Notes

1. **File Validation**: Only PNG, JPG, JPEG, SVG allowed
2. **User Association**: Signatures tied to user ID
3. **Access Control**: Users can only manage their own signatures
4. **Audit Trail**: Signature files preserved even after removal from DB
5. **PDF Integrity**: Signatures embedded as base64 in PDF (non-editable)

## Testing

### Test Signature Upload:
1. Navigate to Settings → Digital Signature
2. Upload a signature image or draw one
3. Verify signature appears in preview
4. Check database: `User.signaturePath` should be set

### Test PDF Integration:
1. Create a memo with approvals
2. Add a comment (with signature uploaded)
3. Click "Preview PDF" or "Download PDF"
4. Verify signature appears above your name in comment section

### Troubleshooting:
- **Signature not showing in PDF**: Check if file exists in `/public/uploads/signatures/`
- **Upload fails**: Verify file type and size
- **PDF generation error**: Check server logs for file read errors

## Future Enhancements

- [ ] Support for multiple signature types (approval, witness, etc.)
- [ ] Signature timestamp verification
- [ ] Digital signature certificates
- [ ] Signature history/versioning
- [ ] Batch signature operations
