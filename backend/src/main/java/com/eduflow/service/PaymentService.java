package com.eduflow.service;

import com.eduflow.dto.PaymentRequest;
import com.eduflow.dto.PaymentResponse;
import com.eduflow.entity.Fee;
import com.eduflow.entity.Payment;
import com.eduflow.entity.Student;
import com.eduflow.entity.User;
import com.eduflow.exception.FeeNotFoundException;
import com.eduflow.exception.InvalidPaymentException;
import com.eduflow.repository.FeeRepository;
import com.eduflow.repository.PaymentRepository;
import com.eduflow.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public PaymentResponse recordPayment(PaymentRequest request, User admin) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new com.eduflow.exception.StudentNotFoundException(
                        "Student not found with id: " + request.getStudentId()));

        Fee fee = feeRepository.findByStudentIdWithStudent(student.getId())
                .orElseThrow(() -> new FeeNotFoundException("Fee not found for student id: " + student.getId()));

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidPaymentException("Payment amount must be positive");
        }

        BigDecimal newPaid = fee.getPaidAmount().add(request.getAmount());
        if (newPaid.compareTo(fee.getTotalAmount()) > 0) {
            throw new InvalidPaymentException(
                    "Payment of " + request.getAmount() + " exceeds pending balance of "
                            + fee.getPendingAmount());
        }

        fee.setPaidAmount(newPaid);
        fee.setPendingAmount(fee.getTotalAmount().subtract(newPaid));
        fee.setStatus(newPaid.compareTo(fee.getTotalAmount()) == 0 ? Fee.Status.PAID : Fee.Status.PARTIAL);
        feeRepository.save(fee);

        String method = (request.getMethod() == null || request.getMethod().isBlank())
                ? "CASH" : request.getMethod().trim().toUpperCase();

        Payment payment = Payment.builder()
                .fee(fee)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .method(method)
                .receivedBy(admin)
                .build();
        return toResponse(paymentRepository.save(payment));
    }

    public List<PaymentResponse> listPayments(Long studentId) {
        if (studentId != null) {
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new com.eduflow.exception.StudentNotFoundException(
                            "Student not found with id: " + studentId));
            Fee fee = feeRepository.findByStudentId(studentId)
                    .orElseThrow(() -> new FeeNotFoundException("Fee not found for student id: " + studentId));
            return paymentRepository.findByFeeIdWithDetails(fee.getId()).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return paymentRepository.findAllWithDetails().stream()
                .map(this::toResponse)
                .toList();
    }

    private PaymentResponse toResponse(Payment payment) {
        Student student = payment.getFee().getStudent();
        return new PaymentResponse(
                payment.getId(),
                payment.getFee().getId(),
                student.getId(),
                student.getUser().getName(),
                payment.getAmount(),
                payment.getPaymentDate(),
                payment.getMethod(),
                payment.getReceivedBy().getName()
        );
    }
}