package com.eduflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalStudents;
    private long totalTeachers;
    private BigDecimal todayAttendancePercentage;
    private BigDecimal pendingFees;
}