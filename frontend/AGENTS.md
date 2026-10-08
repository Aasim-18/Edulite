# EduFlow Lite frontend

React 18 + Vite app for a school/college management system (roles: Admin, Teacher, Student).

## Stack
- React 18, Vite, React Router, Axios
- Plain CSS (no UI libraries unless asked)

## Structure (inside frontend/src)
- components/ reusable UI
- pages/ Login, AdminDashboard, TeacherDashboard, StudentDashboard
- hooks/ custom hooks
- services/ all API calls (Axios), nothing fetches directly inside components

## Rules
- Functional components with hooks only
- Keep code simple, since team members must explain it in the viva
- Use the API base path /api and follow docs/api-contract.md exactly
- Auth: JWT stored after login, sent as `Authorization: Bearer <token>`
- Role-based routing: redirect users to their own dashboard
- Use mock data in services/ until the backend is ready