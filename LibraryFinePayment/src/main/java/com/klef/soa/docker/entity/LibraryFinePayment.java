
package com.klef.soa.docker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="LibraryFinePayment")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LibraryFinePayment
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private Double fineAmount;

    @Column(nullable = false)
    private String paymentDate;

    @Column(nullable = false)
    private Boolean paid;
}
