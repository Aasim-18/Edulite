package com.eduflow.servlet;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

final class ReportRepository {

    Optional<StudentReportData> findStudent(long studentId) throws SQLException {
        String sql = """
                SELECT s.id, u.name, s.roll_number, c.name AS class_name
                FROM students s
                JOIN users u ON u.id = s.user_id
                JOIN classes c ON c.id = s.class_id
                WHERE s.id = ?
                """;
        try (Connection connection = DatabaseConnection.open();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, studentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(new StudentReportData(
                        resultSet.getLong("id"),
                        resultSet.getString("name"),
                        resultSet.getString("roll_number"),
                        resultSet.getString("class_name")
                ));
            }
        }
    }

    List<AttendanceReportRow> findAttendance(long studentId, LocalDate from, LocalDate to) throws SQLException {
        String sql = """
                SELECT a.date, a.status, marker.name AS marked_by
                FROM attendance a
                JOIN users marker ON marker.id = a.marked_by
                WHERE a.student_id = ? AND a.date BETWEEN ? AND ?
                ORDER BY a.date DESC
                """;
        List<AttendanceReportRow> rows = new ArrayList<>();
        try (Connection connection = DatabaseConnection.open();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setLong(1, studentId);
            statement.setDate(2, Date.valueOf(from));
            statement.setDate(3, Date.valueOf(to));
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    rows.add(new AttendanceReportRow(
                            resultSet.getObject("date", LocalDate.class),
                            resultSet.getString("status"),
                            resultSet.getString("marked_by")
                    ));
                }
            }
        }
        return rows;
    }
}
