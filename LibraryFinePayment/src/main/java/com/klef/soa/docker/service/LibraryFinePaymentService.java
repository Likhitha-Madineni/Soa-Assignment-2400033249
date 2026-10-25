
package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.LibraryFinePaymentRequest;
import com.klef.soa.docker.dto.LibraryFinePaymentResponse;

public interface LibraryFinePaymentService
{
    LibraryFinePaymentResponse addPayment(LibraryFinePaymentRequest payment);

    String updatePayment(Long id, LibraryFinePaymentRequest payment);

    LibraryFinePaymentResponse displayById(Long id);

    List<LibraryFinePaymentResponse> displayAll();

    String deletePayment(Long id);
}
