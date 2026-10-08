package com.eduflow.dto;

import com.eduflow.entity.Attendance;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EditAttendanceRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "At least one student is required")
    private List<StatusEntry> entries;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusEntry {
        @NotNull(message = "Student is required")
        private Long studentId;

        @NotNull(message = "Attendance status is required")
        private Attendance.Status status;
    }
}