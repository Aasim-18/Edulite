package com.eduflow.controller;

import com.eduflow.dto.*;
import com.eduflow.entity.SchoolClass;
import com.eduflow.entity.User;
import com.eduflow.service.ClassService;
import com.eduflow.service.CurrentUserService;
import com.eduflow.service.DashboardService;
import com.eduflow.service.FeeService;
import com.eduflow.service.PaymentService;
import com.eduflow.service.StudentService;
import com.eduflow.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ClassService classService;
    private final TeacherService teacherService;
    private final StudentService studentService;
    private final FeeService feeService;
    private final DashboardService dashboardService;
    private final PaymentService paymentService;
    private final CurrentUserService currentUserService;

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return dashboardService.getDashboard();
    }

    // ---- Classes ----

    @GetMapping("/classes")
    public List<SchoolClass> listClasses() {
        return classService.listClasses();
    }

    @PostMapping("/classes")
    public ResponseEntity<SchoolClass> createClass(@Valid @RequestBody ClassRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classService.createClass(request.getName()));
    }

    @PutMapping("/classes/{id}")
    public SchoolClass updateClass(@PathVariable Long id, @Valid @RequestBody ClassRequest request) {
        return classService.updateClass(id, request.getName());
    }

    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Teachers ----

    @GetMapping("/teachers")
    public List<TeacherResponse> listTeachers() {
        return teacherService.listTeachers();
    }

    @PostMapping("/teachers")
    public ResponseEntity<TeacherResponse> createTeacher(@Valid @RequestBody TeacherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teacherService.createTeacher(request));
    }

    @PutMapping("/teachers/{id}")
    public TeacherResponse updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherUpdateRequest request) {
        return teacherService.updateTeacher(id, request);
    }

    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Students ----

    @GetMapping("/students")
    public List<StudentResponse> listStudents() {
        return studentService.listStudents();
    }

    @PostMapping("/students")
    public ResponseEntity<StudentResponse> createStudent(@Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.createStudent(request));
    }

    @PutMapping("/students/{id}")
    public StudentResponse updateStudent(@PathVariable Long id, @Valid @RequestBody StudentUpdateRequest request) {
        return studentService.updateStudent(id, request);
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Fees ----

    @GetMapping("/fees")
    public List<FeeResponse> listFees() {
        return feeService.listFees();
    }

    @PostMapping("/fees")
    public ResponseEntity<FeeResponse> createFee(@Valid @RequestBody FeeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feeService.createFee(request));
    }

    @GetMapping("/fees/{studentId}/receipt")
    public FeeReceiptResponse feeReceipt(@PathVariable Long studentId) {
        return feeService.getReceipt(studentId);
    }

    // ---- Payments ----

    @PostMapping("/payments")
    public ResponseEntity<PaymentResponse> recordPayment(
            @Valid @RequestBody PaymentRequest request, Principal principal) {
        User admin = currentUserService.getCurrentUser(principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(paymentService.recordPayment(request, admin));
    }

    @GetMapping("/payments")
    public List<PaymentResponse> listPayments(@RequestParam(required = false) Long studentId) {
        return paymentService.listPayments(studentId);
    }
}