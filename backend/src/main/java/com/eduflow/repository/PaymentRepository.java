package com.eduflow.repository;

import com.eduflow.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByFeeIdOrderByPaymentDateDesc(Long feeId);

    @Query("""
            select p from Payment p
            join fetch p.fee f
            join fetch f.student s
            join fetch s.user
            join fetch p.receivedBy
            where f.id = :feeId
            order by p.paymentDate desc
            """)
    List<Payment> findByFeeIdWithDetails(@Param("feeId") Long feeId);

    @Query("""
            select p from Payment p
            join fetch p.fee f
            join fetch f.student s
            join fetch s.user
            join fetch p.receivedBy
            order by p.paymentDate desc, p.id desc
            """)
    List<Payment> findAllWithDetails();
}
