package com.klef.soa.docker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LibraryFinePaymentResponse {

    private Long id;
    private String cardNumber;
    private Double fineAmount;
    private String paymentDate;
    private Boolean paid;
}
