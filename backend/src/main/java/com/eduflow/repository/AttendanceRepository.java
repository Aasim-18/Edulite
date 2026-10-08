package com.eduflow.repository;

import com.eduflow.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    long countByDate(LocalDate date);
    long countByDateAndStatusIn(LocalDate date, Collection<Attendance.Status> statuses);

    @Query("""
            select a from Attendance a
            join fetch a.student s
            join fetch s.user
            where a.date = :date
            """)
    List<Attendance> findByDateWithStudent(@Param("date") LocalDate date);

    @Query("""
            select a from Attendance a
            join fetch a.student s
            join fetch s.user
            where s.id = :studentId
            order by a.date desc
            """)
    List<Attendance> findByStudentIdWithStudent(@Param("studentId") Long studentId);
}
