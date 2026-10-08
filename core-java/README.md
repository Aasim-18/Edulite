# EduFlow Lite Core Java Module

This module demonstrates plain Java OOP and JDBC access to the EduFlow Lite
PostgreSQL database without Spring Boot.

## Requirements

- Java 17
- Maven
- The database created with the root `schema.sql` and `seed.sql`
- `DB_URL`, `DB_USER`, and `DB_PASSWORD` environment variables

## Run

```text
mvn clean compile exec:java
```

The console program loads all students, fee summaries, and attendance counts
through separate DAO classes.
