package com.eduflow.repository;

import com.eduflow.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findBySchoolClassIdOrderByCreatedAtDesc(Long classId);

    @Query("""
            select n from Note n
            join fetch n.schoolClass
            join fetch n.teacher
            where n.schoolClass.id = :classId
            order by n.createdAt desc
            """)
    List<Note> findByClassIdWithTeacher(@Param("classId") Long classId);
}
