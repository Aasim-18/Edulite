package com.eduflow.model;

import java.math.BigDecimal;

public record FeeSummary(
        long studentId,
        String studentName,
        String rollNumber,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal pendingAmount,
        String status
) {
}
