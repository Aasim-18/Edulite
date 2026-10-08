# EduFlow Lite Servlet Module

This module is a small Jakarta Servlet/JSP reporting application that reads the
same PostgreSQL database as the Spring Boot backend.

## Requirements

- Java 17
- Maven
- Tomcat 10.1 or another Jakarta Servlet 6 compatible container
- The database created with the root `schema.sql` and `seed.sql`
- `DB_URL`, `DB_USER`, and `DB_PASSWORD` environment variables

## Build

```text
mvn clean package
```

Deploy `target/eduflow-servlet-module.war` to Tomcat.

## Pages

```text
/eduflow-servlet-module/receipt?studentId=1
/eduflow-servlet-module/attendance-report?studentId=1
/eduflow-servlet-module/attendance-report?studentId=1&from=2026-03-01&to=2026-03-31
```
