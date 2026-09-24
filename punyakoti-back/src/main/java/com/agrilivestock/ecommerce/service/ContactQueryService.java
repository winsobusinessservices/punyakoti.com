package com.agrilivestock.ecommerce.service;

import com.agrilivestock.ecommerce.dto.contact.ContactQueryRequest;
import com.agrilivestock.ecommerce.dto.contact.ContactQueryResponse;
import com.agrilivestock.ecommerce.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ContactQueryService {
    ContactQueryResponse createContactQuery(ContactQueryRequest request);
    PageResponse<ContactQueryResponse> getAllContactQueries(Pageable pageable);
    ContactQueryResponse resolveContactQuery(Long id);
    void deleteContactQuery(Long id);
}
