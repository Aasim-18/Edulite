package com.eduflow.repository;

import com.eduflow.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    Optional<Fee> findByStudentId(Long studentId);

    @Query("""
            select f from Fee f
            join fetch f.student s
            join fetch s.user
            join fetch s.schoolClass
            """)
    List<Fee> findAllWithStudent();

    @Query("""
            select f from Fee f
            join fetch f.student s
            join fetch s.user
            join fetch s.schoolClass
            where f.id = :id
            """)
    Optional<Fee> findByIdWithStudent(@Param("id") Long id);

    @Query("""
            select f from Fee f
            join fetch f.student s
            join fetch s.user
            join fetch s.schoolClass
            where s.id = :studentId
            """)
    Optional<Fee> findByStudentIdWithStudent(@Param("studentId") Long studentId);

    @Query("select coalesce(sum(f.pendingAmount), 0) from Fee f where f.status <> :paid")
    BigDecimal sumPendingFees(@Param("paid") Fee.Status paid);
}
