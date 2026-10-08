package com.eduflow.dao;

import com.eduflow.exception.DatabaseOperationException;
import com.eduflow.model.FeeSummary;
import com.eduflow.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

public class FeeDao {

    private static final String FIND_BY_STUDENT = """
            SELECT f.student_id, u.name, s.roll_number, f.total_amount,
                   f.paid_amount, f.pending_amount, f.status
            FROM fees f
            JOIN students s ON s.id = f.student_id
            JOIN users u ON u.id = s.user_id
            WHERE f.student_id = ?
            """;

    public Optional<FeeSummary> findByStudent(long studentId) {
        try (Connection connection = DatabaseConnection.open();
             PreparedStatement statement = connection.prepareStatement(FIND_BY_STUDENT)) {
            statement.setLong(1, studentId);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (!resultSet.next()) {
                    return Optional.empty();
                }
                return Optional.of(new FeeSummary(
                        resultSet.getLong("student_id"),
                        resultSet.getString("name"),
                        resultSet.getString("roll_number"),
                        resultSet.getBigDecimal("total_amount"),
                        resultSet.getBigDecimal("paid_amount"),
                        resultSet.getBigDecimal("pending_amount"),
                        resultSet.getString("status")
                ));
            }
        } catch (SQLException exception) {
            throw new DatabaseOperationException("Unable to load fee details", exception);
        }
    }
}
