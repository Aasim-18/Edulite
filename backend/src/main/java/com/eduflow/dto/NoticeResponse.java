package com.eduflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoticeResponse {

    private Long id;
    private Long authorId;
    private String authorName;
    private String title;
    private String content;
    private String audience;
    private LocalDateTime createdAt;
}