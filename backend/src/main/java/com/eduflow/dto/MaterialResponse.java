package com.eduflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialResponse {

    private Long id;
    private Long classId;
    private String className;
    private Long teacherId;
    private String teacherName;
    private String title;
    private String fileName;
    private Long fileSize;
    private LocalDateTime createdAt;
}