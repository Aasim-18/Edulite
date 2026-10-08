<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="com.eduflow.servlet.StudentReportData" %>
<%@ page import="com.eduflow.servlet.AttendanceReportRow" %>
<%@ page import="java.util.List" %>
<%
    StudentReportData student = (StudentReportData) request.getAttribute("student");
    List<AttendanceReportRow> records = (List<AttendanceReportRow>) request.getAttribute("records");
%>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Attendance Report - <%= student.studentName() %></title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/reports.css">
</head>
<body>
<main class="report-sheet">
    <div class="report-heading">
        <div>
            <p class="eyebrow">EduFlow Lite</p>
            <h1>Attendance Report</h1>
        </div>
        <strong><%= request.getAttribute("from") %> to <%= request.getAttribute("to") %></strong>
    </div>
    <section class="info-grid">
        <div><span>Student</span><strong><%= student.studentName() %></strong></div>
        <div><span>Roll number</span><strong><%= student.rollNumber() %></strong></div>
        <div><span>Class</span><strong><%= student.className() %></strong></div>
        <div><span>Attendance</span><strong><%= request.getAttribute("percentage") %>%</strong></div>
    </section>
    <div class="summary-grid">
        <div><span>Present</span><strong><%= request.getAttribute("present") %></strong></div>
        <div><span>Late</span><strong><%= request.getAttribute("late") %></strong></div>
        <div><span>Absent</span><strong><%= request.getAttribute("absent") %></strong></div>
    </div>
    <table>
        <thead><tr><th>Date</th><th>Status</th><th>Marked by</th></tr></thead>
        <tbody>
        <% for (AttendanceReportRow record : records) { %>
            <tr><td><%= record.date() %></td><td><%= record.status() %></td><td><%= record.markedBy() %></td></tr>
        <% } %>
        </tbody>
    </table>
    <button class="print-button" onclick="window.print()">Print report</button>
</main>
</body>
</html>
