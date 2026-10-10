-- EduFlow Lite: Database seed data
-- Database: PostgreSQL (Supabase)
-- Run manually AFTER schema.sql in the Supabase SQL editor.
-- Demo password for all users: password123
-- Hash is bcrypt for "password123" (Spring Security BCryptPasswordEncoder compatible).

-- 1 Admin
INSERT INTO users (name, email, password, role) VALUES
    ('Admin User', 'admin@eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'ADMIN');

-- 2 Teachers
INSERT INTO users (name, email, password, role) VALUES
    ('Ravi Sharma', 'ravi.sharma@eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'TEACHER'),
    ('Priya Patel', 'priya.patel@eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'TEACHER');

-- 2 Classes
INSERT INTO classes (name) VALUES
    ('CSE-1A'),
    ('CSE-1B');

-- 6 Students (user accounts + student profiles)
-- ids: users 4-9, classes 1-2
INSERT INTO users (name, email, password, role) VALUES
    ('Amit Kumar', 'amit.kumar@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT'),
    ('Sneha Reddy', 'sneha.reddy@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT'),
    ('Rahul Verma', 'rahul.verma@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT'),
    ('Anjali Nair', 'anjali.nair@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT'),
    ('Vikram Singh', 'vikram.singh@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT'),
    ('Kavya Iyer', 'kavya.iyer@student.eduflow.com', '$2b$10$WBP8mA/9swviq1LmknMBy.5T4IoS6fj9PWv8xbtTFujucHKM0sx52', 'STUDENT');

INSERT INTO students (user_id, class_id, roll_number) VALUES
    (4, 1, 'CSE1A-01'),
    (5, 1, 'CSE1A-02'),
    (6, 1, 'CSE1A-03'),
    (7, 2, 'CSE1B-01'),
    (8, 2, 'CSE1B-02'),
    (9, 2, 'CSE1B-03');

-- Fees (one per student)
-- students 1-6, total 50000 each; mix of pending / partial / paid
INSERT INTO fees (student_id, total_amount, paid_amount, pending_amount, status) VALUES
    (1, 50000.00, 0.00,    50000.00, 'PENDING'),
    (2, 50000.00, 20000.00, 30000.00, 'PARTIAL'),
    (3, 50000.00, 50000.00, 0.00,     'PAID'),
    (4, 50000.00, 15000.00, 35000.00, 'PARTIAL'),
    (5, 50000.00, 0.00,    50000.00, 'PENDING'),
    (6, 50000.00, 50000.00, 0.00,     'PAID');

-- Payments (teacher ravi = user 2, teacher priya = user 3)
INSERT INTO payments (fee_id, amount, payment_date, method, received_by) VALUES
    (2, 20000.00, '2026-01-15', 'CASH',    2),
    (3, 30000.00, '2026-01-10', 'UPI',     2),
    (3, 20000.00, '2026-02-01', 'UPI',     3),
    (4, 15000.00, '2026-02-05', 'CARD',    3),
    (6, 50000.00, '2026-01-20', 'UPI',     2);

-- Attendance (recent sample days)
-- teacher ravi (2) for CSE-1A, teacher priya (3) for CSE-1B
INSERT INTO attendance (student_id, date, status, marked_by) VALUES
    (1, '2026-03-01', 'PRESENT', 2),
    (2, '2026-03-01', 'PRESENT', 2),
    (3, '2026-03-01', 'ABSENT',  2),
    (4, '2026-03-01', 'PRESENT', 3),
    (5, '2026-03-01', 'LATE',    3),
    (6, '2026-03-01', 'PRESENT', 3),
    (1, '2026-03-02', 'PRESENT', 2),
    (2, '2026-03-02', 'ABSENT',  2),
    (3, '2026-03-02', 'PRESENT', 2),
    (4, '2026-03-02', 'PRESENT', 3),
    (5, '2026-03-02', 'PRESENT', 3),
    (6, '2026-03-02', 'ABSENT',  3);

-- Notes
INSERT INTO notes (class_id, teacher_id, title, content) VALUES
    (1, 2, 'Unit 2 Syllabus', 'OOP concepts, exception handling, and JDBC basics. Exam on 20th.'),
    (1, 2, 'Lab This Week', 'Bring laptops. JDBC connectivity lab in room 204.'),
    (2, 3, 'Assignment 1', 'Submit Spring Boot REST API mini project by Friday.');

-- Notices (admin = user 1)
INSERT INTO notices (author_id, title, content, audience) VALUES
    (1, 'Semester Break', 'Classes resume on 1st March. Results are out on the portal.', 'ALL'),
    (1, 'Fee Reminder', 'Students with pending fees must clear them before the mid-term exam.', 'STUDENTS'),
    (1, 'Staff Meeting', 'All teachers are requested to attend the monthly meeting on Friday at 3 PM in Room 101.', 'TEACHERS');
