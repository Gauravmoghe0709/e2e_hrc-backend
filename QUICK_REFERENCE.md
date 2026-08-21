# Contact Enquiry API - Quick Reference

## Public Endpoint

```http
POST /api/v1/contact-enquiries
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "company": "ABC Ltd",
  "email": "john@example.com",
  "inquiry_type": "General Enquiry",
  "subject": "Question about services",
  "message": "Hello, I have a question..."
}
```

**Response:**
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

---

## Admin Endpoints (Protected with JWT)

### 1. List Enquiries
```http
GET /api/v1/admin/contact-enquiries?page=1&limit=10&status=new
Authorization: Bearer <JWT_TOKEN>
```

### 2. Get Details
```http
GET /api/v1/admin/contact-enquiries/:id
Authorization: Bearer <JWT_TOKEN>
```

### 3. Update
```http
PATCH /api/v1/admin/contact-enquiries/:id
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>

{
  "status": "in_progress",
  "assigned_to": "507f1f77bcf86cd799439012",
  "internal_notes": "Contacted customer"
}
```

### 4. Delete/Archive
```http
DELETE /api/v1/admin/contact-enquiries/:id
Authorization: Bearer <JWT_TOKEN>
```

---

## Files Created

| File | Purpose |
|------|---------|
| `src/model/contactUs/contactUsEnquiryModel.js` | Database schema |
| `src/controllers/contactUs/contactUsEnquiryController.js` | Business logic |
| `src/router/contactUs/contactUsEnquiryRouter.js` | Route definitions |

---

## Files Modified

| File | Change |
|------|--------|
| `src/app.js` | Added router registration |

---

## Valid Inquiry Types

- General Enquiry
- Recruitment
- Workforce Solutions
- Partnership
- Immigration
- Other

---

## Valid Status Values

- `new` (default)
- `in_progress`
- `resolved`
- `closed`

---

## Reference Number Format

`ENQ-YYYYMMDD-XXXX`

Example: `ENQ-20260820-0001`

Generated automatically, incremented daily.

---

## Data Fields

### Public Submission (Required)
- first_name
- email
- inquiry_type
- subject
- message

### Admin Only Fields
- status
- assigned_to
- internal_notes

### Optional Fields
- last_name
- company
- attachment_url
- attachment_name
- attachment_type
- attachment_size

---

## Key Features

✅ Automatic reference number generation  
✅ Soft delete (not permanent)  
✅ Admin-only field protection  
✅ Pagination & search  
✅ File attachment support  
✅ JWT authentication  
✅ Email validation  
✅ Comprehensive error handling  

---

## Environment Variables Required

- `JWT_SECRET_KEY` - For token verification

---

## Database

Collection: `contactusenquiries`

Indexes on: `reference_number`, `created_at`, `deleted_at`

---

## Troubleshooting

### 401 Unauthorized
- JWT token is missing or invalid
- Include token in cookie `token` or header `Authorization: Bearer <token>`

### 400 Validation Error
- Required field missing
- Invalid email format
- Invalid inquiry_type or status

### 404 Not Found
- Enquiry ID doesn't exist
- Enquiry is soft-deleted

### 500 Server Error
- Database connection issue
- File upload service failure
- Check backend logs

---

## cURL Examples

### Create Enquiry
```bash
curl -X POST http://localhost:3000/api/v1/contact-enquiries \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","email":"john@example.com","inquiry_type":"General Enquiry","subject":"Help","message":"Need help"}'
```

### List Enquiries
```bash
curl http://localhost:3000/api/v1/admin/contact-enquiries \
  -H "Cookie: token=<JWT>"
```

### Update Status
```bash
curl -X PATCH http://localhost:3000/api/v1/admin/contact-enquiries/<ID> \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<JWT>" \
  -d '{"status":"in_progress"}'
```

### Delete Enquiry
```bash
curl -X DELETE http://localhost:3000/api/v1/admin/contact-enquiries/<ID> \
  -H "Cookie: token=<JWT>"
```

---

## Query Parameters (Admin List)

| Parameter | Default | Max | Example |
|-----------|---------|-----|---------|
| page | 1 | - | ?page=2 |
| limit | 10 | 100 | ?limit=50 |
| search | - | - | ?search=john |
| status | - | - | ?status=new |
| inquiry_type | - | - | ?inquiry_type=Recruitment |
| sortBy | created_at | - | ?sortBy=status |
| sortOrder | desc | - | ?sortOrder=asc |

---

## Integration Notes

1. Frontend should POST to `/api/v1/contact-enquiries` (public)
2. Admin panel should use `/api/v1/admin/contact-enquiries` endpoints
3. Pass JWT token for admin endpoints
4. Handle pagination in list responses
5. Show reference_number to user after submission
6. Use soft-deleted records for compliance/audit

---

For full documentation, see: `CONTACT_ENQUIRY_API_DOCUMENTATION.md`
