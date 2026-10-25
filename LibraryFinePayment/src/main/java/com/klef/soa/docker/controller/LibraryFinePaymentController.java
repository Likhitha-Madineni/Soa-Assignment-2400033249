
package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.LibraryFinePaymentRequest;
import com.klef.soa.docker.dto.LibraryFinePaymentResponse;
import com.klef.soa.docker.service.LibraryFinePaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/libraryfinepayment")
@CrossOrigin(origins = "*")
public class LibraryFinePaymentController
{
    @Autowired
    private LibraryFinePaymentService service;

    @GetMapping("/")
    public String home()
    {
        return "Library Fine Payment System";
    }

    @PostMapping("/add")
    public ResponseEntity<LibraryFinePaymentResponse> addPayment( @Valid @RequestBody LibraryFinePaymentRequest request)
    {
        return new ResponseEntity<>(service.addPayment(request), HttpStatus.CREATED);
    }

    @GetMapping("/displayall")
    public ResponseEntity<List<LibraryFinePaymentResponse>> displayAll()
    {
        return ResponseEntity.ok(service.displayAll());
    }

    @GetMapping("/display/{id}")
    public ResponseEntity<LibraryFinePaymentResponse> displayById(@PathVariable Long id)
    {
        LibraryFinePaymentResponse response = service.displayById(id);

        if (response == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePayment( @PathVariable Long id, @Valid @RequestBody LibraryFinePaymentRequest request)
    {
        String result = service.updatePayment(id, request);

        if (result.contains("not found"))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id)
    {
        String result = service.deletePayment(id);

        if (result.contains("not found"))
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);

        return ResponseEntity.ok("Library fine payment deleted successfully.");
    }
}
