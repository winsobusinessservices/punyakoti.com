package com.agrilivestock.ecommerce.controller;

import com.agrilivestock.ecommerce.dto.contact.ContactQueryRequest;
import com.agrilivestock.ecommerce.dto.contact.ContactQueryResponse;
import com.agrilivestock.ecommerce.response.ApiResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.ContactQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ContactQueryController {

    private final ContactQueryService service;

    // Public endpoint to submit a contact query
    @PostMapping("/api/v1/contact")
    public ResponseEntity<ApiResponse<ContactQueryResponse>> submitContactQuery(
            @Valid @RequestBody ContactQueryRequest request) {
        ContactQueryResponse response = service.createContactQuery(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contact query submitted successfully", response));
    }

    // Admin endpoints
    @GetMapping("/api/v1/admin/contact")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ContactQueryResponse>>> getAllQueries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("Contact query data", service.getAllContactQueries(pageable)));
    }

    @PutMapping("/api/v1/admin/contact/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContactQueryResponse>> resolveQuery(@PathVariable Long id) {
        ContactQueryResponse response = service.resolveContactQuery(id);
        return ResponseEntity.ok(ApiResponse.success( "Contact query marked as resolved", response));
    }

    @DeleteMapping("/api/v1/admin/contact/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteQuery(@PathVariable Long id) {
        service.deleteContactQuery(id);
        return ResponseEntity.ok(ApiResponse.success("Contact query deleted successfully"));
    }
}
