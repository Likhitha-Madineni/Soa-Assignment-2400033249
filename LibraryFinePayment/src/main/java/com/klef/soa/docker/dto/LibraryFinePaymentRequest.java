
package com.klef.soa.docker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LibraryFinePaymentRequest {

    @NotBlank(message = "Card number is required")
    private String cardNumber;

    @NotNull(message = "Fine amount is required")
    private Double fineAmount;

    @NotBlank(message = "Payment date is required")
    private String paymentDate;

    @NotNull(message = "Paid status is required")
    private Boolean paid;
}
