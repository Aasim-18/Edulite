package com.eduflow.model;

import java.time.LocalDate;

public record AttendanceRecord(
        long studentId,
        String studentName,
        String rollNumber,
        LocalDate date,
        String status
) {
}
