package com.eduflow.controller;

import com.eduflow.dto.*;
import com.eduflow.entity.StudyMaterial;
import com.eduflow.service.StudentPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
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

    @GetMapping("/receipt")
    public FeeReceiptResponse receipt(Principal principal) {
        return studentPortalService.getReceipt(principal.getName());
    }

    @GetMapping("/payments")
    public List<PaymentResponse> payments(Principal principal) {
        return studentPortalService.getPayments(principal.getName());
    }

    @GetMapping("/notes")
    public List<NoteResponse> notes(Principal principal) {
        return studentPortalService.getNotes(principal.getName());
    }

    @GetMapping("/material")
    public List<MaterialResponse> material(Principal principal) {
        return studentPortalService.listMaterials(principal.getName());
    }

    @GetMapping("/material/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id, Principal principal) {
        StudyMaterial material = studentPortalService.getDownloadableMaterial(id, principal.getName());
        Path file = studentPortalService.resolveMaterialFile(material);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + material.getFileName().replace("\"", "") + "\"")
                .contentLength(material.getFileSize())
                .body(new FileSystemResource(file));
    }

    @GetMapping("/notices")
    public List<NoticeResponse> notices(Principal principal) {
        return studentPortalService.getNotices(principal.getName());
    }
}