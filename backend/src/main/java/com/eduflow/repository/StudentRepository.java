package com.eduflow.repository;

import com.eduflow.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findBySchoolClassId(Long classId);
    Optional<Student> findByUserId(Long userId);
    boolean existsByRollNumber(String rollNumber);

    @Query("select s from Student s join fetch s.user join fetch s.schoolClass")
    List<Student> findAllWithUserAndClass();

    @Query("""
            select s from Student s
            join fetch s.user
            join fetch s.schoolClass
            where s.id = :id
            """)
    Optional<Student> findByIdWithUserAndClass(@Param("id") Long id);

    @Query("""
            select s from Student s
            join fetch s.user
            join fetch s.schoolClass
            where s.user.id = :userId
            """)
    Optional<Student> findByUserIdWithUserAndClass(@Param("userId") Long userId);

    @Query("""
            select s from Student s
            join fetch s.user
            join fetch s.schoolClass
            where s.schoolClass.id = :classId
            """)
    List<Student> findByClassIdWithUser(@Param("classId") Long classId);
}
