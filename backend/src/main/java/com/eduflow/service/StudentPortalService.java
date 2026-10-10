package com.eduflow.service;

import com.eduflow.dto.AttendanceResponse;
import com.eduflow.dto.AttendanceSummaryResponse;
import com.eduflow.dto.FeeReceiptResponse;
import com.eduflow.dto.FeeResponse;
import com.eduflow.dto.MaterialResponse;
import com.eduflow.dto.NoteResponse;
import com.eduflow.dto.NoticeResponse;
import com.eduflow.dto.PaymentResponse;
import com.eduflow.dto.StudentResponse;
import com.eduflow.entity.Payment;
import com.eduflow.entity.Student;
import com.eduflow.entity.StudyMaterial;
import com.eduflow.entity.User;
import com.eduflow.exception.MaterialAccessDeniedException;
import com.eduflow.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentPortalService {

    private final CurrentUserService currentUserService;
    private final StudentService studentService;
    private final AttendanceService attendanceService;
    private final FeeService feeService;
    private final NoteService noteService;
    private final StudyMaterialService studyMaterialService;
    private final NoticeService noticeService;
    private final PaymentRepository paymentRepository;

    public Student getStudentForUser(String email) {
        return studentService.getStudentByUserId(currentUserService.getCurrentUser(email).getId());
    }

    public StudentResponse getProfile(String email) {
        return studentService.getStudentResponseByUserId(currentUserService.getCurrentUser(email).getId());
    }

    public List<AttendanceResponse> getAttendance(String email) {
        return attendanceService.getAttendanceForStudent(getStudentForUser(email).getId());
    }

    public AttendanceSummaryResponse getAttendanceSummary(String email) {
        return attendanceService.getAttendanceSummary(getStudentForUser(email).getId());
    }

    public FeeResponse getFee(String email) {
        return feeService.getFeeForStudent(getStudentForUser(email).getId());
    }

    public FeeReceiptResponse getReceipt(String email) {
        return feeService.getReceipt(getStudentForUser(email).getId());
    }

    public List<PaymentResponse> getPayments(String email) {
        Student student = getStudentForUser(email);
        Long feeId = feeService.getFeeForStudent(student.getId()).getId();
        return paymentRepository.findByFeeIdWithDetails(feeId).stream()
                .map(this::toPaymentResponse)
                .toList();
    }

    public List<NoteResponse> getNotes(String email) {
        return noteService.listNotes(getStudentForUser(email).getSchoolClass().getId());
    }

    public List<MaterialResponse> listMaterials(String email) {
        Long classId = getStudentForUser(email).getSchoolClass().getId();
        return studyMaterialService.listByClass(classId);
    }

    public StudyMaterial getDownloadableMaterial(Long id, String email) {
        StudyMaterial material = studyMaterialService.getMaterialOrThrow(id);
        Long classId = getStudentForUser(email).getSchoolClass().getId();
        if (!material.getSchoolClass().getId().equals(classId)) {
            throw new MaterialAccessDeniedException("This material is not available for your class");
        }
        return material;
    }

    public Path resolveMaterialFile(StudyMaterial material) {
        return studyMaterialService.resolveFile(material);
    }

    public List<NoticeResponse> getNotices(String email) {
        return noticeService.listVisibleTo(User.Role.STUDENT);
    }

    private PaymentResponse toPaymentResponse(Payment payment) {
        User receiver = payment.getReceivedBy();
        return new PaymentResponse(
                payment.getId(),
                payment.getFee().getId(),
                payment.getFee().getStudent().getId(),
                payment.getFee().getStudent().getUser().getName(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getMethod(),
                receiver.getName()
        );
    }
}