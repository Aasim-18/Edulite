package com.eduflow.controller;

import com.eduflow.dto.*;
import com.eduflow.entity.SchoolClass;
import com.eduflow.entity.StudyMaterial;
import com.eduflow.entity.User;
import com.eduflow.service.AttendanceService;
import com.eduflow.service.ClassService;
import com.eduflow.service.CurrentUserService;
import com.eduflow.service.NoteService;
import com.eduflow.service.NoticeService;
import com.eduflow.service.StudentService;
import com.eduflow.service.StudyMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final ClassService classService;
    private final StudentService studentService;
    private final AttendanceService attendanceService;
    private final NoteService noteService;
    private final StudyMaterialService studyMaterialService;
    private final NoticeService noticeService;
    private final CurrentUserService currentUserService;

    @GetMapping("/classes")
    public List<SchoolClass> listClasses() {
        return classService.listClasses();
    }

    @GetMapping("/classes/{classId}/students")
    public List<StudentResponse> listClassStudents(@PathVariable Long classId) {
        return studentService.listStudentsByClass(classId);
    }

    @GetMapping("/attendance")
    public List<AttendanceResponse> getAttendance(
            @RequestParam Long classId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return attendanceService.getAttendance(classId, date);
    }

    @PostMapping("/attendance")
    public ResponseEntity<List<AttendanceResponse>> markAttendance(
            @Valid @RequestBody MarkAttendanceRequest request, Principal principal) {
        User teacher = currentUserService.getCurrentUser(principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.markAttendance(request, teacher));
    }

    @PutMapping("/attendance")
    public List<AttendanceResponse> editAttendance(
            @Valid @RequestBody EditAttendanceRequest request, Principal principal) {
        User teacher = currentUserService.getCurrentUser(principal.getName());
        return attendanceService.editAttendance(request, teacher);
    }

    @GetMapping("/notes/{classId}")
    public List<NoteResponse> listNotes(@PathVariable Long classId) {
        return noteService.listNotes(classId);
    }

    @PostMapping("/notes")
    public ResponseEntity<NoteResponse> createNote(
            @Valid @RequestBody NoteRequest request, Principal principal) {
        User teacher = currentUserService.getCurrentUser(principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(noteService.createNote(request, teacher));
    }

    // ---- Study material ----

    @GetMapping("/material")
    public List<MaterialResponse> listMaterial(@RequestParam Long classId) {
        return studyMaterialService.listByClass(classId);
    }

    @PostMapping("/material")
    public ResponseEntity<MaterialResponse> uploadMaterial(
            @RequestParam Long classId,
            @RequestParam String title,
            @RequestParam MultipartFile file,
            Principal principal) {
        User teacher = currentUserService.getCurrentUser(principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studyMaterialService.upload(file, classId, title, teacher));
    }

    @GetMapping("/material/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id) {
        StudyMaterial material = studyMaterialService.getMaterialOrThrow(id);
        Path file = studyMaterialService.resolveFile(material);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + material.getFileName().replace("\"", "") + "\"")
                .contentLength(material.getFileSize())
                .body(new FileSystemResource(file));
    }

    // ---- Notices (admin posts, teacher reads) ----

    @GetMapping("/notices")
    public List<NoticeResponse> listNotices() {
        return noticeService.listVisibleTo(User.Role.TEACHER);
    }
}