package com.eduflow.service;

import com.eduflow.dto.AttendanceResponse;
import com.eduflow.dto.AttendanceSummaryResponse;
import com.eduflow.dto.EditAttendanceRequest;
import com.eduflow.dto.MarkAttendanceRequest;
import com.eduflow.entity.Attendance;
import com.eduflow.entity.Student;
import com.eduflow.entity.User;
import com.eduflow.exception.DuplicateAttendanceException;
import com.eduflow.exception.StudentNotFoundException;
import com.eduflow.repository.AttendanceRepository;
import com.eduflow.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final ClassService classService;

    public List<AttendanceResponse> getAttendance(Long classId, LocalDate date) {
        classService.getClassOrThrow(classId);
        Set<Long> classStudentIds = studentRepository.findBySchoolClassId(classId).stream()
                .map(Student::getId)
                .collect(Collectors.toSet());

        return attendanceRepository.findByDateWithStudent(date).stream()
                .filter(a -> classStudentIds.contains(a.getStudent().getId()))
                .map(this::toResponse)
                .toList();
    }

    public List<AttendanceResponse> markAttendance(MarkAttendanceRequest request, User currentTeacher) {
        classService.getClassOrThrow(request.getClassId());
        Set<Long> classStudentIds = studentRepository.findBySchoolClassId(request.getClassId()).stream()
                .map(Student::getId)
                .collect(Collectors.toSet());

        List<Attendance> created = request.getEntries().stream()
                .map(entry -> {
                    Long studentId = entry.getStudentId();
                    if (!classStudentIds.contains(studentId)) {
                        throw new StudentNotFoundException("Student id " + studentId
                                + " is not enrolled in class id " + request.getClassId());
                    }
                    if (attendanceRepository.findByStudentIdAndDate(studentId, request.getDate()).isPresent()) {
                        throw new DuplicateAttendanceException("Attendance already marked for student "
                                + studentId + " on " + request.getDate());
                    }
                    Student student = studentRepository.findById(studentId).orElseThrow(
                            () -> new StudentNotFoundException("Student not found with id: " + studentId));
                    return Attendance.builder()
                            .student(student)
                            .date(request.getDate())
                            .status(entry.getStatus())
                            .markedBy(currentTeacher)
                            .build();
                })
                .map(attendanceRepository::save)
                .toList();

        return created.stream().map(this::toResponse).toList();
    }

    public List<AttendanceResponse> editAttendance(EditAttendanceRequest request, User currentTeacher) {
        List<Attendance> updated = request.getEntries().stream()
                .map(entry -> {
                    Attendance existing = attendanceRepository
                            .findByStudentIdAndDate(entry.getStudentId(), request.getDate())
                            .orElseGet(() -> {
                                Student student = studentRepository.findById(entry.getStudentId())
                                        .orElseThrow(() -> new StudentNotFoundException(
                                                "Student not found with id: " + entry.getStudentId()));
                                return Attendance.builder()
                                        .student(student)
                                        .date(request.getDate())
                                        .markedBy(currentTeacher)
                                        .build();
                            });
                    existing.setStatus(entry.getStatus());
                    existing.setMarkedBy(currentTeacher);
                    return attendanceRepository.save(existing);
                })
                .toList();

        return updated.stream().map(this::toResponse).toList();
    }

    public List<AttendanceResponse> getAttendanceForStudent(Long studentId) {
        return attendanceRepository.findByStudentIdWithStudent(studentId).stream()
                .map(this::toResponse)
                .toList();
    }

    public AttendanceSummaryResponse getAttendanceSummary(Long studentId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        long total = records.size();
        long present = records.stream().filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        long late = records.stream().filter(a -> a.getStatus() == Attendance.Status.LATE).count();
        long absent = records.stream().filter(a -> a.getStatus() == Attendance.Status.ABSENT).count();

        BigDecimal percentage = total == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf((present + late) * 100.0 / total)
                        .setScale(1, RoundingMode.HALF_UP);

        return new AttendanceSummaryResponse(total, present, late, absent, percentage);
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        Student student = attendance.getStudent();
        return new AttendanceResponse(
                attendance.getId(),
                student.getId(),
                student.getUser().getName(),
                student.getRollNumber(),
                attendance.getDate(),
                attendance.getStatus().name()
        );
    }
}