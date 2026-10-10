package com.eduflow.service;

import com.eduflow.dto.NoticeRequest;
import com.eduflow.dto.NoticeResponse;
import com.eduflow.entity.Notice;
import com.eduflow.entity.User;
import com.eduflow.exception.InvalidNoticeException;
import com.eduflow.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeResponse create(NoticeRequest request, User author) {
        Notice.Audience audience = parseAudience(request.getAudience());
        Notice notice = Notice.builder()
                .author(author)
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .audience(audience)
                .build();
        return toResponse(noticeRepository.save(notice));
    }

    public List<NoticeResponse> listAll() {
        return noticeRepository.findAllWithAuthor().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NoticeResponse> listVisibleTo(User.Role role) {
        List<Notice.Audience> visibleTo = role == User.Role.STUDENT
                ? List.of(Notice.Audience.ALL, Notice.Audience.STUDENTS)
                : List.of(Notice.Audience.ALL, Notice.Audience.TEACHERS);
        return noticeRepository.findVisibleWithAuthor(visibleTo).stream()
                .map(this::toResponse)
                .toList();
    }

    private Notice.Audience parseAudience(String audience) {
        if (audience == null || audience.isBlank()) {
            throw new InvalidNoticeException("Audience is required");
        }
        try {
            return Notice.Audience.valueOf(audience.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidNoticeException("Audience must be ALL, STUDENTS or TEACHERS");
        }
    }

    private NoticeResponse toResponse(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getAuthor().getId(),
                notice.getAuthor().getName(),
                notice.getTitle(),
                notice.getContent(),
                notice.getAudience().name(),
                notice.getCreatedAt()
        );
    }
}