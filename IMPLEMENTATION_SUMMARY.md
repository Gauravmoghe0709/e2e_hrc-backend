# Contact Us Enquiry API - Implementation Summary

## Date: August 20, 2026

---

## NEW FILES CREATED

### 1. Model
**File:** `src/model/contactUs/contactUsEnquiryModel.js`
- **Purpose:** Mongoose schema for contact enquiries
- **Size:** ~140 lines
- **Key Features:**
  - Auto-generates unique reference numbers (ENQ-YYYYMMDD-XXXX)
  - Soft delete support with `deleted_at` field
  - Email validation with regex
  - Pre-save hooks for reference number generation
  - Query hooks to exclude soft-deleted records

### 2. Controller
**File:** `src/controllers/contactUs/contactUsEnquiryController.js`
- **Purpose:** Business logic for contact enquiry operations
- **Size:** ~450 lines
- **Functions:**
  - `createEnquiry()` - Public API for form submission
  - `getAllEnquiries()` - Admin API with pagination, search, filtering
  - `getEnquiryById()` - Get specific enquiry details
  - `updateEnquiry()` - Update admin-only fields
  - `deleteEnquiry()` - Soft delete implementation
- **Features:**
  - Comprehensive input validation
  - Error handling for Mongoose validation errors
  - Pagination (default: 10, max: 100)
  - Search across multiple fields
  - Filtering by status and inquiry_type
  - File upload support with metadata tracking

### 3. Router
**File:** `src/router/contactUs/contactUsEnquiryRouter.js`
- **Purpose:** Express route definitions
- **Size:** ~40 lines
- **Routes:**
  - `POST /v1/contact-enquiries` - Public submission
  - `GET /v1/admin/contact-enquiries` - Admin list
  - `GET /v1/admin/contact-enquiries/:id` - Admin get by ID
  - `PATCH /v1/admin/contact-enquiries/:id` - Admin update
  - `DELETE /v1/admin/contact-enquiries/:id` - Admin delete
- **Middleware:**
  - File upload middleware for attachments
  - JWT authentication for admin routes

### 4. Documentation
**File:** `CONTACT_ENQUIRY_API_DOCUMENTATION.md`
- Complete API documentation with examples
- Request/response samples
- Data model reference
- Security details
- Usage examples with cURL

---

## EXISTING FILES MODIFIED

### Only ONE file was modified (minimal change):

**File:** `src/app.js`
- **Line 31:** Added import for new router
  ```javascript
  const contactUsEnquiryRouter = require('./router/contactUs/contactUsEnquiryRouter');
  ```
- **Line 69:** Registered router with Express
  ```javascript
  app.use('/api', contactUsEnquiryRouter);
  ```

**Why?** 
- Required to register the new router so endpoints are accessible
- Change is minimal and non-breaking
- No existing functionality affected
- No existing imports removed or changed

---

## FILES NOT MODIFIED (Kept Intact)

The following existing contact enquiry related files were **NOT TOUCHED**:
- `src/model/Home models/HomepageContactEnquiry.model.js`
- `src/router/HomeRouters/HomecontactEnquiry.routes.js`
- `src/controllers/HomeControllers/HomecontactEnquiry.controller.js`
- `src/model/contactUs/contactUsModel.js` (CMS contact section)
- `src/router/contactUs/contactUsRoutes.js` (CMS contact section)
- `src/controllers/contactUs/contactUsController.js` (CMS contact section)

**Reason:** New module uses distinct naming to avoid conflicts.

---

## API ENDPOINTS CREATED

### Public API
```
POST /api/v1/contact-enquiries
```
- Accepts: first_name, last_name (optional), company (optional), email, inquiry_type, subject, message, attachment metadata
- Returns: Success with reference_number and status
- Auth: None (public)

### Admin API (Protected with JWT)
```
GET /api/v1/admin/contact-enquiries
  Query params: page, limit, search, status, inquiry_type, sortBy, sortOrder

GET /api/v1/admin/contact-enquiries/:id
  Returns: Complete enquiry details including internal_notes

PATCH /api/v1/admin/contact-enquiries/:id
  Accepts: status, assigned_to, internal_notes
  Returns: Updated enquiry

DELETE /api/v1/admin/contact-enquiries/:id
  Action: Soft delete (sets deleted_at timestamp)
  Returns: Null data with success message
```

All admin endpoints require valid JWT token in cookie or Authorization header.

---

## DATABASE SCHEMA

### ContactUsEnquiry Collection

```javascript
{
  _id: ObjectId,
  reference_number: "ENQ-20260820-0001" (unique, auto-generated),
  
  // Core Fields
  first_name: String (required),
  last_name: String (optional),
  company: String (optional),
  email: String (required, validated),
  inquiry_type: String (enum),
  subject: String (required),
  message: String (required),
  
  // Attachment Fields
  attachment_url: String (optional),
  attachment_name: String (optional),
  attachment_type: String (optional),
  attachment_size: Number (optional),
  
  // Admin Fields
  status: "new" | "in_progress" | "resolved" | "closed" (default: "new"),
  assigned_to: ObjectId (optional, references User),
  internal_notes: String (optional),
  
  // Timestamps
  created_at: Date (auto),
  updated_at: Date (auto),
  deleted_at: Date (optional, null by default)
}
```

**Indexes:**
- `reference_number`: Unique, sparse
- `created_at`: For sorting and range queries
- `deleted_at`: For soft delete filtering

---

## SECURITY IMPLEMENTATION

### 1. Field Access Control
- **Public API cannot set:**
  - status
  - assigned_to
  - internal_notes
  - reference_number
  - created_at, updated_at, deleted_at
- **Admin API can only update:**
  - status
  - assigned_to
  - internal_notes
- **User-submitted fields are immutable:**
  - Cannot be changed after initial submission

### 2. Authentication
- Admin endpoints protected by JWT middleware
- Token extracted from cookie `token` or `Authorization` header
- Verified against `JWT_SECRET_KEY` environment variable
- User info attached to `req.user` for audit purposes

### 3. Input Validation
- Email format validated on both model and controller
- ObjectId validation for ID parameters
- Required fields validated before processing
- String trimming to prevent whitespace issues

### 4. Sensitive Data
- Internal_notes NOT returned in public endpoints
- Populated admin data only includes name and email (not password)
- No raw database errors exposed to client

---

## ASSUMPTIONS MADE

1. **User Model:**
   - Project has a User model registered as "User"
   - User has fields: _id, name, email
   - Adjust `assigned_to` field if structure differs

2. **Upload Service:**
   - `src/services/storage.services.js` exists and exports `uploadFile(buffer, filename, folder)`
   - Returns object with `{ url: string }` property
   - Handles file storage to cloud/S3/ImageKit etc.

3. **Environment:**
   - `JWT_SECRET_KEY` environment variable is set
   - MongoDB connection already configured through mongoose
   - Multer configured for 5MB file limit

4. **Existing Middleware:**
   - `auth.middleware.js` - JWT verification
   - `upload.middleware.js` - File upload handler
   - Both are used as-is without modification

5. **Project Structure:**
   - Express app in `app.js`
   - Controllers in `src/controllers/`
   - Models in `src/model/`
   - Routers in `src/router/`

---

## TESTING PERFORMED

### Syntax Validation
✅ All JavaScript files validated for syntax errors

### Files Checked
✅ `contactUsEnquiryModel.js` - Valid
✅ `contactUsEnquiryController.js` - Valid  
✅ `contactUsEnquiryRouter.js` - Valid
✅ `app.js` - Valid after modifications

### Potential Issues
None identified. Module should be ready for runtime testing.

---

## IMPLEMENTATION CHECKLIST

- [x] New model created with all required fields
- [x] Reference number auto-generation implemented
- [x] Soft delete functionality implemented
- [x] Public API endpoint created
- [x] Admin list API with pagination implemented
- [x] Admin search and filtering implemented
- [x] Admin get by ID endpoint created
- [x] Admin update endpoint (admin fields only)
- [x] Admin delete endpoint (soft delete)
- [x] JWT authentication applied to admin routes
- [x] Input validation implemented
- [x] Error handling implemented
- [x] Router registered in app.js
- [x] No existing files overwritten
- [x] No duplicate model registration
- [x] File upload support included
- [x] Soft-deleted records excluded from queries
- [x] Documentation created

---

## NEXT STEPS

1. **Start Backend:**
   ```bash
   npm run dev
   ```

2. **Test Public API:**
   ```bash
   POST http://localhost:3000/api/v1/contact-enquiries
   ```

3. **Get JWT Token:**
   - Login through admin authentication to obtain JWT token

4. **Test Admin APIs:**
   ```bash
   GET http://localhost:3000/api/v1/admin/contact-enquiries
   (Include JWT token in cookie or Authorization header)
   ```

5. **Verify Database:**
   - Check MongoDB for `contactusenquiries` collection
   - Verify reference numbers are being generated

6. **Frontend Integration:**
   - Update frontend service to use `/api/v1/contact-enquiries` endpoint
   - Handle response format with `success`, `message`, `data`

---

## FILES LISTING

### Created Files
```
src/
├── model/
│   └── contactUs/
│       └── contactUsEnquiryModel.js (NEW)
│
├── controllers/
│   └── contactUs/
│       └── contactUsEnquiryController.js (NEW)
│
└── router/
    └── contactUs/
        └── contactUsEnquiryRouter.js (NEW)

CONTACT_ENQUIRY_API_DOCUMENTATION.md (NEW)
IMPLEMENTATION_SUMMARY.md (NEW - this file)
```

### Modified Files
```
src/
└── app.js (MODIFIED - added router registration)
```

### Unchanged Existing Files
```
src/model/contactUs/contactUsModel.js
src/model/Home models/HomepageContactEnquiry.model.js
src/controllers/contactUs/contactUsController.js
src/controllers/HomeControllers/HomecontactEnquiry.controller.js
src/router/contactUs/contactUsRoutes.js
src/router/HomeRouters/HomecontactEnquiry.routes.js
```

---

## Questions / Support

For any issues:
1. Check syntax: `node -c <filename>`
2. Verify imports match exact file paths
3. Ensure MongoDB is running
4. Check environment variables: `JWT_SECRET_KEY`
5. Verify JWT token validity for admin endpoints
6. Review console logs for detailed error messages

---

## Version Info

- **Implementation Date:** August 20, 2026
- **Node.js Version:** v18+ (CommonJS)
- **MongoDB:** Mongoose v9.7.0
- **Express:** v5.2.1
- **API Version:** v1
- **Status:** Ready for testing
