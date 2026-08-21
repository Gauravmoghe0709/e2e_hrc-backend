# Contact Us Enquiry API Documentation

## Overview

A complete Contact Us Enquiry API module for collecting, managing, and tracking customer enquiries. This module includes:
- Public API for form submissions
- Admin API for enquiry management
- Automatic reference number generation
- Soft delete/archive functionality
- Pagination, search, and filtering
- File attachment support

## Files Created

### 1. Model
**File:** `src/model/contactUs/contactUsEnquiryModel.js`
- MongoDB Mongoose schema for contact enquiries
- Automatic reference number generation (ENQ-YYYYMMDD-XXXX)
- Soft delete support with `deleted_at` field
- Email validation
- Pre-save hooks for reference number generation
- Query hooks to exclude soft-deleted records by default

### 2. Controller
**File:** `src/controllers/contactUs/contactUsEnquiryController.js`
- `createEnquiry()` - Public API endpoint for form submission
- `getAllEnquiries()` - Admin API with pagination, search, and filtering
- `getEnquiryById()` - Get specific enquiry details
- `updateEnquiry()` - Update admin-controlled fields only
- `deleteEnquiry()` - Soft delete functionality

### 3. Router
**File:** `src/router/contactUs/contactUsEnquiryRouter.js`
- Public routes
- Protected admin routes using authentication middleware

### 4. App Registration
**File Modified:** `src/app.js`
- Added new router to express app with `/api` prefix

---

## API Endpoints

### PUBLIC API

#### 1. Submit Contact Enquiry
```http
POST /api/v1/contact-enquiries
```

**Description:** Submit a new contact enquiry from the public website

**Headers:**
```
Content-Type: application/json
(or multipart/form-data if including file attachment)
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "company": "ABC Ltd",
  "email": "john@example.com",
  "inquiry_type": "General Enquiry",
  "subject": "Need more information",
  "message": "I would like to know more about your services.",
  "attachment_url": "https://example.com/file.pdf",
  "attachment_name": "document.pdf",
  "attachment_type": "application/pdf",
  "attachment_size": 125000
}
```

**Required Fields:**
- `first_name` (string)
- `email` (string, valid email format)
- `inquiry_type` (string, enum below)
- `subject` (string)
- `message` (string)

**Optional Fields:**
- `last_name` (string)
- `company` (string)
- `attachment_url` (string)
- `attachment_name` (string)
- `attachment_type` (string)
- `attachment_size` (number)

**Valid Inquiry Types:**
- General Enquiry
- Recruitment
- Workforce Solutions
- Partnership
- Immigration
- Other

**Success Response (201):**
```json
{
  "success": true,
  "message": "Contact enquiry created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "reference_number": "ENQ-20260820-0001",
    "status": "new"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "First name is required"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

### ADMIN API (Protected)

All admin endpoints require authentication via JWT token in cookie or Authorization header.

#### 1. Get All Enquiries
```http
GET /api/v1/admin/contact-enquiries?page=1&limit=10&search=john&status=new&inquiry_type=General%20Enquiry&sortBy=created_at&sortOrder=desc
```

**Description:** Retrieve paginated list of enquiries with filtering and search

**Authentication:** Required (JWT token)

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10, max: 100) - Records per page
- `search` (string, optional) - Search by reference_number, first_name, last_name, email, company, or subject
- `status` (string, optional) - Filter by status: new, in_progress, resolved, closed
- `inquiry_type` (string, optional) - Filter by inquiry type
- `sortBy` (string, default: created_at) - Sort field: created_at, updated_at, reference_number, status
- `sortOrder` (string, default: desc) - Sort order: asc, desc

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact enquiries fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "reference_number": "ENQ-20260820-0001",
      "first_name": "John",
      "last_name": "Doe",
      "company": "ABC Ltd",
      "email": "john@example.com",
      "inquiry_type": "General Enquiry",
      "subject": "Need more information",
      "message": "I would like to know more about your services.",
      "attachment_url": "https://cdn.example.com/file.pdf",
      "attachment_name": "document.pdf",
      "attachment_type": "application/pdf",
      "attachment_size": 125000,
      "status": "new",
      "assigned_to": null,
      "internal_notes": null,
      "created_at": "2026-08-20T10:30:00.000Z",
      "updated_at": "2026-08-20T10:30:00.000Z",
      "deleted_at": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Error Response (401):**
```json
{
  "message": "unauthorized no token found"
}
```

---

#### 2. Get Enquiry by ID
```http
GET /api/v1/admin/contact-enquiries/:id
```

**Description:** Get detailed information about a specific enquiry

**Authentication:** Required (JWT token)

**URL Parameters:**
- `id` (string, MongoDB ObjectId) - Enquiry ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Enquiry fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "reference_number": "ENQ-20260820-0001",
    "first_name": "John",
    "last_name": "Doe",
    "company": "ABC Ltd",
    "email": "john@example.com",
    "inquiry_type": "General Enquiry",
    "subject": "Need more information",
    "message": "I would like to know more about your services.",
    "attachment_url": "https://cdn.example.com/file.pdf",
    "attachment_name": "document.pdf",
    "attachment_type": "application/pdf",
    "attachment_size": 125000,
    "status": "new",
    "assigned_to": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "internal_notes": "Contacted the customer, waiting for response",
    "created_at": "2026-08-20T10:30:00.000Z",
    "updated_at": "2026-08-20T10:35:00.000Z",
    "deleted_at": null
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid enquiry ID format"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Enquiry not found"
}
```

---

#### 3. Update Enquiry (Admin Fields Only)
```http
PATCH /api/v1/admin/contact-enquiries/:id
```

**Description:** Update enquiry status, assignment, and internal notes

**Authentication:** Required (JWT token)

**URL Parameters:**
- `id` (string, MongoDB ObjectId) - Enquiry ID

**Request Body:**
```json
{
  "status": "in_progress",
  "assigned_to": "507f1f77bcf86cd799439012",
  "internal_notes": "Contacted the customer and waiting for response."
}
```

**Updatable Fields:**
- `status` (string, enum: new, in_progress, resolved, closed)
- `assigned_to` (string, MongoDB ObjectId or null)
- `internal_notes` (string or null)

**NOT Updatable (will be ignored):**
- `reference_number`
- `first_name`, `last_name`, `company`, `email`, `inquiry_type`, `subject`, `message`
- `attachment_url`, `attachment_name`, `attachment_type`, `attachment_size`
- `created_at`, `deleted_at`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Enquiry updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "reference_number": "ENQ-20260820-0001",
    "first_name": "John",
    "last_name": "Doe",
    "company": "ABC Ltd",
    "email": "john@example.com",
    "inquiry_type": "General Enquiry",
    "subject": "Need more information",
    "message": "I would like to know more about your services.",
    "attachment_url": "https://cdn.example.com/file.pdf",
    "attachment_name": "document.pdf",
    "attachment_type": "application/pdf",
    "attachment_size": 125000,
    "status": "in_progress",
    "assigned_to": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "internal_notes": "Contacted the customer and waiting for response.",
    "created_at": "2026-08-20T10:30:00.000Z",
    "updated_at": "2026-08-20T10:35:00.000Z",
    "deleted_at": null
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid status value"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Enquiry not found"
}
```

---

#### 4. Delete/Archive Enquiry (Soft Delete)
```http
DELETE /api/v1/admin/contact-enquiries/:id
```

**Description:** Archive/soft delete an enquiry. The record is not physically deleted but marked as deleted.

**Authentication:** Required (JWT token)

**URL Parameters:**
- `id` (string, MongoDB ObjectId) - Enquiry ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Enquiry deleted successfully",
  "data": null
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid enquiry ID format"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Enquiry not found"
}
```

---

## Data Model

### ContactUsEnquiry Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `_id` | ObjectId | Auto | MongoDB primary key |
| `reference_number` | String | Auto | Unique, format: ENQ-YYYYMMDD-XXXX |
| `first_name` | String | Yes | Trimmed |
| `last_name` | String | No | Default: null, Trimmed |
| `company` | String | No | Default: null, Trimmed |
| `email` | String | Yes | Valid email format, lowercase |
| `inquiry_type` | String | Yes | Enum: General Enquiry, Recruitment, Workforce Solutions, Partnership, Immigration, Other |
| `subject` | String | Yes | Trimmed |
| `message` | String | Yes | Trimmed |
| `attachment_url` | String | No | Default: null |
| `attachment_name` | String | No | Default: null |
| `attachment_type` | String | No | Default: null |
| `attachment_size` | Number | No | Default: null |
| `status` | String | No | Default: "new", Enum: new, in_progress, resolved, closed |
| `assigned_to` | ObjectId | No | Reference to User model |
| `internal_notes` | String | No | Default: null |
| `created_at` | Date | Auto | Auto-generated timestamp |
| `updated_at` | Date | Auto | Auto-updated timestamp |
| `deleted_at` | Date | No | Default: null, Set for soft delete |

---

## Key Features

### 1. Automatic Reference Number Generation
- Format: `ENQ-YYYYMMDD-XXXX`
- Generated automatically on save
- Unique constraint with sparse index (allows null during creation)
- Sequence number resets daily

### 2. Soft Delete
- Records are never permanently deleted
- `deleted_at` field is set to current timestamp
- Soft-deleted records excluded from default queries
- Archived records remain in database for audit/compliance

### 3. Admin-Only Fields
- `status`, `assigned_to`, `internal_notes` cannot be set by public API
- Only admins can modify these fields via PATCH endpoint
- Public form submission always creates enquiries with `status: "new"`

### 4. Security
- Email validation on both model and controller level
- ObjectId validation for ID parameters
- Protected admin routes using JWT authentication
- No exposure of internal notes in public endpoints

### 5. Pagination
- Default: 10 records per page
- Max limit: 100 records per page
- Returns total count and page information

### 6. Search & Filtering
- Search across: reference_number, first_name, last_name, email, company, subject
- Filter by: status, inquiry_type
- Case-insensitive search using regex

### 7. Sorting
- Default: `created_at` descending (newest first)
- Sortable fields: created_at, updated_at, reference_number, status

### 8. File Attachment
- Optional file upload support
- Uses existing project upload middleware
- Stores: URL, name, type, size
- Max file size: 5MB (inherited from upload middleware)
- Allowed types: images, PDF, DOC, DOCX

---

## Authentication

All admin endpoints (`/api/v1/admin/*`) are protected using JWT authentication middleware.

**How to authenticate:**
1. Include JWT token in cookie named `token`
2. OR include in Authorization header: `Bearer <token>`

The middleware:
- Verifies token against `JWT_SECRET_KEY` environment variable
- Extracts user information and attaches to `req.user`
- Returns 401 Unauthorized if token is missing or invalid

---

## Error Handling

| Status | Scenario | Response |
|--------|----------|----------|
| 201 | Enquiry created successfully | Success with reference number |
| 200 | Admin operation successful | Success with data |
| 400 | Validation error (missing fields, invalid format, etc.) | Error message describing issue |
| 400 | Invalid ObjectId format | "Invalid enquiry ID format" |
| 401 | Missing or invalid JWT token | "unauthorized no token found" or "unauthorized invalid token" |
| 404 | Enquiry not found | "Enquiry not found" |
| 500 | Unexpected server error | "Internal server error" |

---

## Usage Examples

### Example 1: Submit Enquiry with cURL
```bash
curl -X POST http://localhost:3000/api/v1/contact-enquiries \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "company": "ABC Ltd",
    "email": "john@example.com",
    "inquiry_type": "General Enquiry",
    "subject": "Need more information",
    "message": "I would like to know more about your services."
  }'
```

### Example 2: Get All Enquiries (Admin)
```bash
curl -X GET "http://localhost:3000/api/v1/admin/contact-enquiries?page=1&limit=10&status=new" \
  -H "Cookie: token=<JWT_TOKEN>"
```

### Example 3: Update Enquiry Status (Admin)
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/contact-enquiries/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<JWT_TOKEN>" \
  -d '{
    "status": "in_progress",
    "assigned_to": "507f1f77bcf86cd799439012",
    "internal_notes": "Contacted customer, waiting for response"
  }'
```

### Example 4: Delete/Archive Enquiry (Admin)
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/contact-enquiries/507f1f77bcf86cd799439011 \
  -H "Cookie: token=<JWT_TOKEN>"
```

---

## Assumptions Made

1. **User Model Reference:** The `assigned_to` field references a `User` model. Adjust if your user model has a different name.

2. **File Upload Service:** Uses existing `uploadFile()` service from `src/services/storage.services.js` which should return an object with `{ url: string }`.

3. **JWT Token:** Authentication uses JWT stored in cookies or Authorization header, verified against `JWT_SECRET_KEY` environment variable.

4. **Multer Middleware:** File uploads are handled by existing multer middleware with 5MB limit for images/documents.

5. **MongoDB Connection:** Assumes MongoDB is already configured and mongoose is connected through existing configuration.

6. **Email Service:** No email notifications implemented. Enquiry creation/updates are logged in database only.

---

## Integration Checklist

- [x] Model created with all required fields
- [x] Auto reference number generation working
- [x] Soft delete functionality implemented
- [x] Public API endpoint functional
- [x] Admin list API with pagination/search/filter
- [x] Admin get by ID endpoint
- [x] Admin update endpoint (admin fields only)
- [x] Admin delete endpoint (soft delete)
- [x] Authentication middleware applied
- [x] Error handling and validation
- [x] Router registered in app.js
- [x] No existing files modified (except app.js for registration)
- [x] No duplicate model registration

---

## Testing Endpoints

### Test Public Submission
```
POST http://localhost:3000/api/v1/contact-enquiries
Content-Type: application/json

{
  "first_name": "Test",
  "email": "test@example.com",
  "inquiry_type": "General Enquiry",
  "subject": "Test Subject",
  "message": "Test message"
}
```

### Test Admin List
```
GET http://localhost:3000/api/v1/admin/contact-enquiries?page=1&limit=10
Cookie: token=<YOUR_JWT_TOKEN>
```

### Test Admin Get By ID
```
GET http://localhost:3000/api/v1/admin/contact-enquiries/<ID>
Cookie: token=<YOUR_JWT_TOKEN>
```

### Test Admin Update
```
PATCH http://localhost:3000/api/v1/admin/contact-enquiries/<ID>
Content-Type: application/json
Cookie: token=<YOUR_JWT_TOKEN>

{
  "status": "in_progress",
  "internal_notes": "Test note"
}
```

### Test Admin Delete
```
DELETE http://localhost:3000/api/v1/admin/contact-enquiries/<ID>
Cookie: token=<YOUR_JWT_TOKEN>
```

---

## Support

For issues or questions about this API:
1. Check the error response message
2. Verify JWT token validity for admin endpoints
3. Ensure all required fields are provided
4. Check database connection status
5. Review console logs on backend for detailed errors
