package com.eduflow.service;

import com.eduflow.dto.MaterialResponse;
import com.eduflow.entity.StudyMaterial;
import com.eduflow.entity.User;
import com.eduflow.exception.InvalidFileException;
import com.eduflow.exception.MaterialNotFoundException;
import com.eduflow.repository.StudyMaterialRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudyMaterialService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final StudyMaterialRepository studyMaterialRepository;
    private final ClassService classService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
    }

    public MaterialResponse upload(MultipartFile file, Long classId, String title, User teacher) {
        if (title == null || title.isBlank()) {
            throw new InvalidFileException("Title is required");
        }
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("Please choose a file to upload");
        }
        if (!isPdf(file)) {
            throw new InvalidFileException("Only PDF files are allowed");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidFileException("File is too large (maximum 5 MB)");
        }

        String storedName = UUID.randomUUID() + ".pdf";
        Path target = Paths.get(uploadDir).resolve(storedName);
        try {
            file.transferTo(target.toAbsolutePath());
        } catch (IOException e) {
            throw new InvalidFileException("Could not save the file, please try again");
        }

        StudyMaterial material = StudyMaterial.builder()
                .schoolClass(classService.getClassOrThrow(classId))
                .teacher(teacher)
                .title(title.trim())
                .fileName(file.getOriginalFilename())
                .storedName(storedName)
                .fileSize(file.getSize())
                .build();
        return toResponse(studyMaterialRepository.save(material));
    }

    public List<MaterialResponse> listByClass(Long classId) {
        classService.getClassOrThrow(classId);
        return studyMaterialRepository.findByClassIdWithDetails(classId).stream()
                .map(this::toResponse)
                .toList();
    }

    public StudyMaterial getMaterialOrThrow(Long id) {
        return studyMaterialRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new MaterialNotFoundException("Material not found with id: " + id));
    }

    public Path resolveFile(StudyMaterial material) {
        return Paths.get(uploadDir).resolve(material.getStoredName());
    }

    private boolean isPdf(MultipartFile file) {
        String contentType = file.getContentType();
        String name = file.getOriginalFilename();
        return "application/pdf".equalsIgnoreCase(contentType)
                || (name != null && name.toLowerCase().endsWith(".pdf"));
    }

    private MaterialResponse toResponse(StudyMaterial material) {
        return new MaterialResponse(
                material.getId(),
                material.getSchoolClass().getId(),
                material.getSchoolClass().getName(),
                material.getTeacher().getId(),
                material.getTeacher().getName(),
                material.getTitle(),
                material.getFileName(),
                material.getFileSize(),
                material.getCreatedAt()
        );
    }
}