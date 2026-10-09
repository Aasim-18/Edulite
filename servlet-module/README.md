# EduFlow Lite Servlet Module

This module is a small Jakarta Servlet/JSP reporting application that reads the
same PostgreSQL database as the Spring Boot backend. It currently provides the
attendance report page; the fee receipt feature has moved to the Spring Boot API
(`GET /api/admin/fees/{studentId}/receipt` and `GET /api/student/receipt`).

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
/eduflow-servlet-module/attendance-report?studentId=1
/eduflow-servlet-module/attendance-report?studentId=1&from=2026-03-01&to=2026-03-31
```

## Run locally (no Tomcat install needed)

The Maven wrapper in the `backend/` folder runs this module too. Cargo
auto-downloads Tomcat 10.1 to `target/` and serves the app on port 8081
(so it never clashes with the Spring Boot backend on 8080).

```text
backend\mvnw.cmd -f servlet-module\pom.xml package cargo:run
```

Stop it with `Ctrl+C` in that terminal window.
