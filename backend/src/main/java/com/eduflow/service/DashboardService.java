package com.eduflow.service;

import com.eduflow.dto.DashboardResponse;
import com.eduflow.entity.Attendance;
import com.eduflow.entity.Fee;
import com.eduflow.entity.User;
import com.eduflow.repository.AttendanceRepository;
import com.eduflow.repository.FeeRepository;
import com.eduflow.repository.StudentRepository;
import com.eduflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final FeeRepository feeRepository;

    public DashboardResponse getDashboard() {
        long totalStudents = studentRepository.count();
        long totalTeachers = userRepository.countByRole(User.Role.TEACHER);

        LocalDate today = LocalDate.now();
        long todayTotal = attendanceRepository.countByDate(today);
        long todayPresent = attendanceRepository.countByDateAndStatusIn(
                today, List.of(Attendance.Status.PRESENT, Attendance.Status.LATE));
        BigDecimal todayAttendancePercentage = todayTotal == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(todayPresent * 100.0 / todayTotal)
                        .setScale(1, RoundingMode.HALF_UP);

        BigDecimal pendingFees = feeRepository.sumPendingFees(Fee.Status.PAID);

        return new DashboardResponse(totalStudents, totalTeachers, todayAttendancePercentage, pendingFees);
    }
}