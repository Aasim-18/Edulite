package com.eduflow.servlet;

public record StudentReportData(
        long studentId,
        String studentName,
        String rollNumber,
        String className
) {
}
