package com.eduflow.controller;

import com.eduflow.dto.*;
import com.eduflow.service.StudentPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentPortalService studentPortalService;

    @GetMapping("/profile")
    public StudentResponse profile(Principal principal) {
        return studentPortalService.getProfile(principal.getName());
    }

    @GetMapping("/attendance")
    public List<AttendanceResponse> attendance(Principal principal) {
        return studentPortalService.getAttendance(principal.getName());
    }

    @GetMapping("/attendance/summary")
    public AttendanceSummaryResponse attendanceSummary(Principal principal) {
        return studentPortalService.getAttendanceSummary(principal.getName());
    }

    @GetMapping("/fees")
    public FeeResponse fees(Principal principal) {
        return studentPortalService.getFee(principal.getName());
    }

    @GetMapping("/payments")
    public List<PaymentResponse> payments(Principal principal) {
        return studentPortalService.getPayments(principal.getName());
    }

    @GetMapping("/notes")
    public List<NoteResponse> notes(Principal principal) {
        return studentPortalService.getNotes(principal.getName());
    }
}