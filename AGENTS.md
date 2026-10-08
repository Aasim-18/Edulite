# EduFlow Lite

A simple school/college management system built as a college team project (Java, Web Programming, React, Spring syllabus). Roles: Admin, Teacher, Student. It is for college submission, so a working demo and syllabus coverage matter more than perfect code or structure.

## Features
- Login with JWT and role-based access (Admin, Teacher, Student)
- Admin: manage classes, teachers, students, fee structure; dashboard (total students, total teachers, today's attendance %, pending fees)
- Teacher: mark/edit attendance per class and date, post notes for a class
- Student: view own attendance %, fee status and payment history, notes
- Fees: record payments, pending balance updates automatically, overpayment blocked
- Receipts/reports: printable fee receipt and attendance report (Servlet/JSP module)

## Repo structure
- `backend/`: Spring Boot REST API (main application)
- `frontend/`: React app (being built separately with GitHub Copilot)
- `servlet-module/`: small Servlet + JSP demo (receipt/report pages), reads the same PostgreSQL DB
- `core-java/`: plain Java OOP + JDBC module
- `docs/`: API contract, ER diagram, report
- `schema.sql`, `seed.sql`: source of truth for the database

## Folder boundaries (IMPORTANT)
- Backend work happens ONLY in `backend/`, plus root `schema.sql` and `seed.sql` when asked.
- Do NOT touch `frontend/`, `servlet-module/`, or `core-java/` unless explicitly asked. Other developers and tools are working there.
- Do not modify files outside the current task's scope.

## Backend stack
- Java 17, Maven
- Spring Boot 3.x
- Spring Web, Spring Data JPA (Hibernate)
- PostgreSQL, hosted on Supabase (used only as a plain database; no Supabase auth, SDK, or REST API)
- Spring Security + JWT (jjwt)
- Spring AOP, Validation, Lombok

## Backend package structure
`com.eduflow` with sub-packages: `controller`, `service`, `repository`, `entity`, `dto`, `security`, `aspect`, `exception`.

## Database (PostgreSQL / Supabase)
- Tables: `users`, `classes`, `students`, `attendance`, `fees`, `payments`, `notes`.
- Use PostgreSQL syntax in `schema.sql` (`GENERATED ALWAYS AS IDENTITY` or `SERIAL`, never `AUTO_INCREMENT`, no backticks).
- `users.role` is one of ADMIN, TEACHER, STUDENT.
- `attendance` has a unique constraint on (student_id, date).
- `spring.jpa.hibernate.ddl-auto=validate`. Entities must match `schema.sql` exactly. Do not change one without the other.
- Do NOT run schema or seed scripts automatically. The developer runs them manually in the Supabase SQL editor.
- Use the Supabase session pooler JDBC connection string (the direct connection is IPv6-only on the free tier).

## Secrets
- DB credentials and JWT secret come from environment variables: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`.
- Never hardcode or commit real passwords. Keep a `backend/.env.example` with placeholders, and keep the real `.env` in `.gitignore`.

## Coding rules
- Keep layers separate: controller -> service -> repository.
- Use constructor injection.
- Use custom exceptions (e.g. `StudentNotFoundException`, `DuplicateAttendanceException`, `InvalidPaymentException`) with a `@RestControllerAdvice` global handler returning clean JSON errors.
- Validate request bodies with `@Valid` where it is easy.
- Enforce role-based access in the security config.
- Add an AOP aspect that logs method entry/exit and execution time for service methods.
- DTOs are preferred but not mandatory. Returning entities directly is acceptable if it keeps things simple, as long as passwords are never exposed in responses.

## Code style
- Keep code simple and readable. Every team member must be able to explain it in the viva.
- Add short comments where the logic is not obvious.
- No unnecessary libraries or abstractions. No need for tests unless asked.

## API conventions
- Base path: `/api`. JSON only.
- Error shape: `{ "message": "...", "status": 400 }`
- Login: `POST /api/auth/login` with `{ "email", "password" }` returns:
  `{ "token": "...", "user": { "id", "name", "email", "role" } }`
  Send the token as `Authorization: Bearer <token>`.
- Enable CORS for the frontend dev server (`http://localhost:5173`).
- The full endpoint list lives in `docs/api-contract.md`. Follow it exactly, since the frontend depends on it.

## Working rules
- Build in small steps and wait for confirmation before moving to the next module.
- After each step, say what was created and how to test it (Postman or curl).
- Do not run the app, Maven, or database scripts unless asked.