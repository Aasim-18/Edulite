package com.eduflow.servlet;

import java.time.LocalDate;

public record AttendanceReportRow(
        LocalDate date,
        String status,
        String markedBy
) {
}
