package com.klef.soa.docker.service;




import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.LibraryFinePaymentRequest;
import com.klef.soa.docker.dto.LibraryFinePaymentResponse;
import com.klef.soa.docker.entity.LibraryFinePayment;
import com.klef.soa.docker.repository.LibraryFinePaymentRepository;
import com.klef.soa.docker.service.LibraryFinePaymentService;

@Service
public class LibraryFinePaymentServiceImpl implements LibraryFinePaymentService
{
    @Autowired
    private LibraryFinePaymentRepository repo;

    @Override
    public LibraryFinePaymentResponse addPayment(LibraryFinePaymentRequest request)
    {
        LibraryFinePayment payment = LibraryFinePayment.builder()
                .cardNumber(request.getCardNumber())
                .fineAmount(request.getFineAmount())
                .paymentDate(request.getPaymentDate())
                .paid(request.getPaid())
                .build();

        LibraryFinePayment savedPayment = repo.save(payment);

        return mapToResponse(savedPayment);
    }

    @Override
    public List<LibraryFinePaymentResponse> displayAll()
    {
        return repo.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public String deletePayment(Long id)
    {
        if (repo.existsById(id))
        {
            repo.deleteById(id);
            return "Library fine payment deleted successfully";
        }
        else
        {
            return "Library fine payment not found";
        }
    }

    @Override
    public String updatePayment(Long id, LibraryFinePaymentRequest request)
    {
        if (repo.existsById(id))
        {
            LibraryFinePayment payment = LibraryFinePayment.builder()
                    .id(id)
                    .cardNumber(request.getCardNumber())
                    .fineAmount(request.getFineAmount())
                    .paymentDate(request.getPaymentDate())
                    .paid(request.getPaid())
                    .build();

            repo.save(payment);
            return "Library fine payment updated successfully";
        }

        return "Library fine payment with ID " + id + " not found";
    }

    @Override
    public LibraryFinePaymentResponse displayById(Long id)
    {
        LibraryFinePayment payment = repo.findById(id).orElse(null);

        if (payment == null)
            return null;

        return mapToResponse(payment);
    }

    private LibraryFinePaymentResponse mapToResponse(LibraryFinePayment payment)
    {
        return LibraryFinePaymentResponse.builder()
                .id(payment.getId())
                .cardNumber(payment.getCardNumber())
                .fineAmount(payment.getFineAmount())
                .paymentDate(payment.getPaymentDate())
                .paid(payment.getPaid())
                .build();
    }
}
