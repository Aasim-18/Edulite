package com.eduflow.repository;

import com.eduflow.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("""
            select n from Notice n
            join fetch n.author
            order by n.createdAt desc
            """)
    List<Notice> findAllWithAuthor();

    @Query("""
            select n from Notice n
            join fetch n.author
            where n.audience in :visibleTo
            order by n.createdAt desc
            """)
    List<Notice> findVisibleWithAuthor(@Param("visibleTo") List<Notice.Audience> visibleTo);
}