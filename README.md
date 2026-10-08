# EduFlow Lite

A simple school/college management system built as a college project (Java, Web Programming, React, Spring syllabus). Roles: Admin, Teacher, Student.

## Folder Structure

```text
edulite/
├── .gitignore
├── README.md
├── schema.sql
├── seed.sql
├── docs/
│   ├── api-contract.md
│   └── er-diagram.md
├── core-java/
│   └── src/com/eduflow/
│       ├── model/
│       ├── exception/
│       ├── dao/
│       └── util/
├── servlet-module/
│   ├── src/com/eduflow/servlet/
│   └── webapp/
│       ├── jsp/
│       ├── css/
│       └── js/
├── backend/
│   └── src/main/java/com/eduflow/
│       ├── controller/
│       ├── service/
│       ├── repository/
│       ├── entity/
│       ├── dto/
│       ├── security/
│       ├── aspect/
│       └── exception/
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        └── services/
```

## Setup Steps

- [ ] **Prerequisites**: Install Java 17, Maven, Node.js, PostgreSQL/Supabase, and Tomcat 10.1 for the Servlet module
- [ ] **Database**: Configure database connection and run schema.sql and seed.sql
- [ ] **Backend**: Build and run the Spring Boot application
- [ ] **Frontend**: Install dependencies and start the React development server
- [ ] **Core Java**: Build and run the JDBC console module
- [ ] **Servlet module**: Build the WAR and deploy it to Tomcat 10.1+
