package com.eduflow.servlet;

import java.math.BigDecimal;

public record FeeReceiptData(
        long feeId,
        long studentId,
        String studentName,
        String email,
        String rollNumber,
        String className,
        BigDecimal totalAmount,
        BigDecimal paidAmount,
        BigDecimal pendingAmount,
        String status
) {
}
