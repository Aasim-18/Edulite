package com.eduflow.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@WebServlet("/attendance-report")
public class AttendanceReportServlet extends HttpServlet {

    private final ReportRepository repository = new ReportRepository();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Long studentId = parseId(request.getParameter("studentId"));
        if (studentId == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "studentId is required");
            return;
        }

        LocalDate to = parseDate(request.getParameter("to"), LocalDate.now());
        LocalDate from = parseDate(request.getParameter("from"), to.minusMonths(1));
        if (from.isAfter(to)) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "from must be before to");
            return;
        }

        try {
            var student = repository.findStudent(studentId);
            if (student.isEmpty()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Student not found");
                return;
            }
            List<AttendanceReportRow> records = repository.findAttendance(studentId, from, to);
            long present = records.stream().filter(row -> "PRESENT".equals(row.status())).count();
            long late = records.stream().filter(row -> "LATE".equals(row.status())).count();
            long absent = records.stream().filter(row -> "ABSENT".equals(row.status())).count();
            double percentage = records.isEmpty() ? 0 : ((present + late) * 100.0) / records.size();

            request.setAttribute("student", student.get());
            request.setAttribute("records", records);
            request.setAttribute("from", from);
            request.setAttribute("to", to);
            request.setAttribute("present", present);
            request.setAttribute("late", late);
            request.setAttribute("absent", absent);
            request.setAttribute("percentage", String.format("%.1f", percentage));
            request.getRequestDispatcher("/WEB-INF/jsp/attendance-report.jsp").forward(request, response);
        } catch (SQLException | IllegalStateException exception) {
            throw new ServletException("Unable to load attendance report", exception);
        }
    }

    private Long parseId(String value) {
        try {
            return value == null ? null : Long.valueOf(value);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private LocalDate parseDate(String value, LocalDate fallback) throws IOException {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IOException("Dates must use yyyy-MM-dd format", exception);
        }
    }
}
