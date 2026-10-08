package com.eduflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponse {

    private long totalDays;
    private long presentDays;
    private long lateDays;
    private long absentDays;
    private BigDecimal percentage;
}