package com.eduflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private Long feeId;
    private Long studentId;
    private String studentName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private String method;
    private String receivedBy;
}