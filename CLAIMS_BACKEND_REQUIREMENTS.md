# Claims System Backend Requirements

## Claims API Endpoints Required

### 1. Submit New Claim
```
POST /api/claims/
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- claim_type: string (death, medical, education, emergency, other)
- amount_requested: decimal
- description: text (min 10 characters)
- supporting_documents: file (optional, PDF/JPG/PNG, max 5MB)
```

### 2. Get User Claims
```
GET /api/claims/
Authorization: Bearer {token}

Response: Array of user's claims with status, amounts, dates, admin notes
```

### 3. Admin Claims Management
```
GET /api/admin/claims/  # All claims for admin
PUT /api/claims/{id}/   # Approve/reject with admin notes
```

## Claims Data Model

```python
class Claim(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    claim_type = models.CharField(max_length=50, choices=[
        ('death', 'Death Benefit'),
        ('medical', 'Medical Benefit'), 
        ('education', 'Education Benefit'),
        ('emergency', 'Emergency Benefit'),
        ('other', 'Other')
    ])
    amount_requested = models.DecimalField(max_digits=10, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    supporting_documents = models.FileField(upload_to='claims/', blank=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('paid', 'Paid')
    ])
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

## Expected JSON Response Format

### User Claims List
```json
[
  {
    "id": 1,
    "claim_type": "medical",
    "amount_requested": "500.00",
    "amount_approved": "450.00",
    "description": "Medical expenses for surgery",
    "status": "approved",
    "admin_notes": "Approved with documentation review",
    "created_at": "2024-01-15T10:30:00Z",
    "supporting_documents": "/media/claims/document.pdf"
  }
]
```

## File Upload Requirements
- **Accepted formats**: PDF, JPG, JPEG, PNG
- **Max file size**: 5MB
- **Storage**: Secure file storage with access control
- **Validation**: File type and size validation on backend

## Admin Approval Process
- Admins can view all claims in admin dashboard
- Approve/reject claims with admin notes
- Update claim status and approved amount
- Send notifications to users on status change

## Test Claims Submission
```bash
curl -X POST http://localhost:8000/api/claims/ \
  -H "Authorization: Bearer {token}" \
  -F "claim_type=medical" \
  -F "amount_requested=500.00" \
  -F "description=Medical expenses for treatment" \
  -F "supporting_documents=@receipt.pdf"
```