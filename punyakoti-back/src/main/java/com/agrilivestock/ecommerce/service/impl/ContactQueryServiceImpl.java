package com.agrilivestock.ecommerce.service.impl;

import com.agrilivestock.ecommerce.dto.contact.ContactQueryRequest;
import com.agrilivestock.ecommerce.dto.contact.ContactQueryResponse;
import com.agrilivestock.ecommerce.entity.ContactQuery;
import com.agrilivestock.ecommerce.exception.ResourceNotFoundException;
import com.agrilivestock.ecommerce.mapper.ContactQueryMapper;
import com.agrilivestock.ecommerce.repository.ContactQueryRepository;
import com.agrilivestock.ecommerce.response.PageResponse;
import com.agrilivestock.ecommerce.service.ContactQueryService;
import com.agrilivestock.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactQueryServiceImpl implements ContactQueryService {

    private final ContactQueryRepository repository;
    private final ContactQueryMapper mapper;
    private final EmailService emailService;

    @Override
    @Transactional
    public ContactQueryResponse createContactQuery(ContactQueryRequest request) {
        ContactQuery query = ContactQuery.builder()
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .subject(request.subject())
                .message(request.message())
                .build();
        
        ContactQuery saved = repository.save(query);
        
        // Send email to admin
        emailService.sendContactQueryEmailToAdmin(
                saved.getName(),
                saved.getEmail(),
                saved.getPhone() != null ? saved.getPhone() : "N/A",
                saved.getSubject(),
                saved.getMessage()
        );
        
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContactQueryResponse> getAllContactQueries(Pageable pageable) {
        Page<ContactQuery> page = repository.findAllByOrderByCreatedAtDesc(pageable);
        List<ContactQueryResponse> content = page.getContent().stream()
                .map(mapper::toResponse)
                .toList();
        return PageResponse.of(page, content);
    }

    @Override
    @Transactional
    public ContactQueryResponse resolveContactQuery(Long id) {
        ContactQuery query = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact query not found with id: " + id));
        query.setResolved(true);
        return mapper.toResponse(repository.save(query));
    }

    @Override
    @Transactional
    public void deleteContactQuery(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Contact query not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
