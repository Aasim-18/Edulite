package com.eduflow.service;

import com.eduflow.dto.FeeCreateRequest;
import com.eduflow.dto.FeeResponse;
import com.eduflow.entity.Fee;
import com.eduflow.entity.Student;
import com.eduflow.exception.DuplicateResourceException;
import com.eduflow.exception.FeeNotFoundException;
import com.eduflow.repository.FeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final StudentService studentService;

    public List<FeeResponse> listFees() {
        return feeRepository.findAllWithStudent().stream()
                .map(this::toResponse)
                .toList();
    }

    public FeeResponse createFee(FeeCreateRequest request) {
        Student student = studentService.getStudentOrThrow(request.getStudentId());
        if (feeRepository.findByStudentId(request.getStudentId()).isPresent()) {
            throw new DuplicateResourceException("Fee record already exists for student id: " + request.getStudentId());
        }

        Fee fee = Fee.builder()
                .student(student)
                .totalAmount(request.getTotalAmount())
                .paidAmount(BigDecimal.ZERO)
                .pendingAmount(request.getTotalAmount())
                .status(Fee.Status.PENDING)
                .build();
        return toResponse(feeRepository.save(fee));
    }

    public FeeResponse getFee(Long id) {
        return toResponse(feeRepository.findByIdWithStudent(id)
                .orElseThrow(() -> new FeeNotFoundException("Fee not found with id: " + id)));
    }

    public FeeResponse getFeeForStudent(Long studentId) {
        return toResponse(feeRepository.findByStudentIdWithStudent(studentId)
                .orElseThrow(() -> new FeeNotFoundException("Fee not found for student id: " + studentId)));
    }

    public Fee getFeeEntity(Long id) {
        return feeRepository.findByIdWithStudent(id)
                .orElseThrow(() -> new FeeNotFoundException("Fee not found with id: " + id));
    }

    private FeeResponse toResponse(Fee fee) {
        Student student = fee.getStudent();
        return new FeeResponse(
                fee.getId(),
                student.getId(),
                student.getUser().getName(),
                student.getRollNumber(),
                fee.getTotalAmount(),
                fee.getPaidAmount(),
                fee.getPendingAmount(),
                fee.getStatus().name()
        );
    }
}