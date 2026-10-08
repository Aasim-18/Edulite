package com.eduflow.service;

import com.eduflow.dto.NoteRequest;
import com.eduflow.dto.NoteResponse;
import com.eduflow.entity.Note;
import com.eduflow.entity.User;
import com.eduflow.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final ClassService classService;

    public List<NoteResponse> listNotes(Long classId) {
        classService.getClassOrThrow(classId);
        return noteRepository.findByClassIdWithTeacher(classId).stream()
                .map(this::toResponse)
                .toList();
    }

    public NoteResponse createNote(NoteRequest request, User teacher) {
        Note note = Note.builder()
                .schoolClass(classService.getClassOrThrow(request.getClassId()))
                .teacher(teacher)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        return toResponse(noteRepository.save(note));
    }

    private NoteResponse toResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getSchoolClass().getId(),
                note.getSchoolClass().getName(),
                note.getTeacher().getId(),
                note.getTeacher().getName(),
                note.getTitle(),
                note.getContent(),
                note.getCreatedAt()
        );
    }
}