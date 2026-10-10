package com.eduflow.repository;

import com.eduflow.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {

    @Query("""
            select m from StudyMaterial m
            join fetch m.schoolClass
            join fetch m.teacher
            where m.schoolClass.id = :classId
            order by m.createdAt desc
            """)
    List<StudyMaterial> findByClassIdWithDetails(@Param("classId") Long classId);

    @Query("""
            select m from StudyMaterial m
            join fetch m.schoolClass
            join fetch m.teacher
            where m.id = :id
            """)
    Optional<StudyMaterial> findByIdWithDetails(@Param("id") Long id);
}