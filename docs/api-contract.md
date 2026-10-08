# EduFlow Lite — API Contract

Base URL: `http://localhost:8080`
Base path for all endpoints: `/api`
Format: JSON only.

---

## Authentication

All endpoints except `/api/health`, `/api/auth/**`, `GET /api/health` require a JWT token:

```
Authorization: Bearer <token>
```

### `POST /api/auth/login` — public

Request:
```json
{ "email": "admin@eduflow.com", "password": "password123" }
```

Response `200`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "name": "Admin User", "email": "admin@eduflow.com", "role": "ADMIN" }
}
```

Roles: `ADMIN`, `TEACHER`, `STUDENT`.

---

## Error shape

Every error returns:
```json
{ "message": "reason", "status": 400 }
```

Common statuses:
| Status | Meaning |
|---|---|
| 400 | Validation / invalid payment |
| 401 | Missing/invalid token, bad credentials |
| 404 | Resource not found |
| 409 | Conflict (duplicate email/class/roll no, duplicate attendance) |

---

## Admin — `/api/admin/**` (role: ADMIN)

### Dashboard
`GET /api/admin/dashboard`

Response `200`:
```json
{
  "totalStudents": 6,
  "totalTeachers": 2,
  "todayAttendancePercentage": 83.3,
  "pendingFees": 165000.00
}
```

### Classes

`GET /api/admin/classes` → `[{ "id", "name", "createdAt" }]`

`POST /api/admin/classes` (201) with `{ "name": "CSE-2A" }`

`PUT /api/admin/classes/{id}` with `{ "name" }`

`DELETE /api/admin/classes/{id}` → 204 (400 if class is in use)

### Teachers

`GET /api/admin/teachers` → `[{ "id", "name", "email" }]`

`POST /api/admin/teachers` (201) with:
```json
{ "name": "Ravi Sharma", "email": "ravi@eduflow.com", "password": "secret123" }
```

`PUT /api/admin/teachers/{id}` with `{ "name", "email", "password" }` (password optional)

`DELETE /api/admin/teachers/{id}` → 204 (only users with role TEACHER)

### Students

`GET /api/admin/students` → `[{ "id", "name", "email", "rollNumber", "classId", "className" }]`

`POST /api/admin/students` (201) with:
```json
{ "name": "Amit Kumar", "email": "amit@eduflow.com", "password": "secret123", "classId": 1, "rollNumber": "CSE1A-01" }
```

`PUT /api/admin/students/{id}` with `{ "name", "email", "classId", "rollNumber" }`

`DELETE /api/admin/students/{id}` → 204

### Fees

`GET /api/admin/fees` → `[{ "id", "studentId", "studentName", "rollNumber", "totalAmount", "paidAmount", "pendingAmount", "status" }]`

Fee status: `PENDING` | `PARTIAL` | `PAID`

`POST /api/admin/fees` (201) with `{ "studentId": 1, "totalAmount": 50000.00 }`
→ creates a fee with `paidAmount` 0, `pendingAmount == totalAmount`, status `PENDING`. One fee per student (duplicate → 409).

### Payments

`POST /api/admin/payments` (201) with:
```json
{ "studentId": 2, "amount": 30000.00, "paymentDate": "2026-04-01", "method": "UPI" }
```
- Updates the student's fee: adds to `paidAmount`, reduces `pendingAmount`.
- Sets status `PAID` when fully paid, else `PARTIAL`.
- Overpayment → 400 `InvalidPaymentException`.
- `method` optional (defaults to `CASH`).

`GET /api/admin/payments?studentId=` → `[{ "id", "feeId", "studentId", "studentName", "amount", "paymentDate", "method", "receivedBy" }]`
- Without `studentId`: all payments. With `studentId`: payments for that student.

---

## Teacher — `/api/teacher/**` (roles: TEACHER or ADMIN)

`GET /api/teacher/classes` → `[{ "id", "name", "createdAt" }]`

`GET /api/teacher/classes/{classId}/students` → `[{ "id", "name", "email", "rollNumber", "classId", "className" }]`

### Attendance

`GET /api/teacher/attendance?classId=1&date=2026-03-01`
→ `[{ "id", "studentId", "studentName", "rollNumber", "date", "status" }]`
(only records already marked for that class + date; use the roster endpoint to see unmarked students)

`POST /api/teacher/attendance` (201) — mark new attendance:
```json
{
  "classId": 1,
  "date": "2026-03-03",
  "entries": [
    { "studentId": 1, "status": "PRESENT" },
    { "studentId": 2, "status": "ABSENT" }
  ]
}
```
→ `[{ "id", "studentId", "studentName", "rollNumber", "date", "status" }]`
Status: `PRESENT` | `ABSENT` | `LATE`. Duplicate (student + date) → 409.

`PUT /api/teacher/attendance` — edit existing:
```json
{ "date": "2026-03-03", "entries": [ { "studentId": 2, "status": "LATE" } ] }
```
Updates existing rows, creates rows that don't exist yet.

### Notes

`GET /api/teacher/notes/{classId}`
→ `[{ "id", "classId", "className", "teacherId", "teacherName", "title", "content", "createdAt" }]`

`POST /api/teacher/notes` (201) with `{ "classId": 1, "title": "Revision", "content": "Bring notes tomorrow" }`

---

## Student — `/api/student/**` (roles: STUDENT or ADMIN)

All responses are scoped to the logged-in user (from the JWT).

`GET /api/student/profile` → `{ "id", "name", "email", "rollNumber", "classId", "className" }`

`GET /api/student/attendance` → `[{ "id", "studentId", "studentName", "rollNumber", "date", "status" }]`

`GET /api/student/attendance/summary`
```json
{ "totalDays": 12, "presentDays": 10, "lateDays": 1, "absentDays": 1, "percentage": 91.7 }
```

`GET /api/student/fees` → `{ "id", "studentId", "studentName", "rollNumber", "totalAmount", "paidAmount", "pendingAmount", "status" }` (404 if no fee record)

`GET /api/student/payments` → `[{ "id", "feeId", "studentId", "studentName", "amount", "paymentDate", "method", "receivedBy" }]`

`GET /api/student/notes` → `[{ "id", "classId", "className", "teacherId", "teacherName", "title", "content", "createdAt" }]`

---

## Health

`GET /api/health` — public
```json
{ "status": "ok" }
```

---

## Notes for the frontend
- Dates submitted as `yyyy-MM-dd` (e.g. `2026-03-01`).
- Money fields are numbers with decimals (`totalAmount`), not currency strings.
- No CORS is configured — call via a proxy or same-origin setup if needed.
- `DELETE` returns `204 No Content` (empty body).