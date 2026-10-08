package com.eduflow.dao;

import com.eduflow.exception.DatabaseOperationException;
import com.eduflow.model.AttendanceRecord;
import com.eduflow.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AttendanceDao {

    private static final String FIND_BY_STUDENT = """
            SELECT a.student_id, u.name, s.roll_number, a.date, a.status
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            JOIN users u ON u.id = s.user_id
            WHERE a.student_id = ?
            ORDER BY a.date DESC
            """;

    public List<AttendanceRecord> findByStudent(long studentId) {
        List<AttendanceRecord> records = new ArrayList<>();
        try (Connection connection = DatabaseConnection.open();
             PreparedStatement statement = connection.prepareStatement(FIND_BY_STUDENT)) {
            statement.setLong(1, studentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    records.add(new AttendanceRecord(
                            resultSet.getLong("student_id"),
                            resultSet.getString("name"),
                            resultSet.getString("roll_number"),
                            resultSet.getObject("date", LocalDate.class),
                            resultSet.getString("status")
                    ));
                }
            }
            return records;
        } catch (SQLException exception) {
            throw new DatabaseOperationException("Unable to load attendance", exception);
        }
    }
}
