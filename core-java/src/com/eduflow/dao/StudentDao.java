package com.eduflow.dao;

import com.eduflow.exception.DatabaseOperationException;
import com.eduflow.model.Student;
import com.eduflow.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class StudentDao {

    private static final String FIND_ALL = """
            SELECT s.id, u.name, u.email, c.name AS class_name, s.roll_number
            FROM students s
            JOIN users u ON u.id = s.user_id
            JOIN classes c ON c.id = s.class_id
            ORDER BY c.name, s.roll_number
            """;

    public List<Student> findAll() {
        List<Student> students = new ArrayList<>();
        try (Connection connection = DatabaseConnection.open();
             PreparedStatement statement = connection.prepareStatement(FIND_ALL);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                students.add(new Student(
                        resultSet.getLong("id"),
                        resultSet.getString("name"),
                        resultSet.getString("email"),
                        resultSet.getString("class_name"),
                        resultSet.getString("roll_number")
                ));
            }
            return students;
        } catch (SQLException exception) {
            throw new DatabaseOperationException("Unable to load students", exception);
        }
    }
}
