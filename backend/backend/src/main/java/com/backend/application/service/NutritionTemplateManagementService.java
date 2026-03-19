package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.NutritionTemplateJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionTemplateRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.AssignNutritionTemplateRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
import com.backend.presentation.dto.NutritionTemplateResponse;
import com.backend.presentation.dto.NutritionTemplateUpsertRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NutritionTemplateManagementService {

    private final SpringDataNutritionTemplateRepository templateRepository;
    private final SpringDataNutritionPlanRepository nutritionPlanRepository;
    private final SpringDataUserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NutritionTemplateResponse> getAll() {
        return templateRepository.findAll().stream()
                .map(this::toTemplateResponse)
                .toList();
    }

    @Transactional
    public NutritionTemplateResponse create(NutritionTemplateUpsertRequest request) {
        NutritionTemplateJpaEntity entity = new NutritionTemplateJpaEntity();
        entity.setId(UUID.randomUUID());
        apply(entity, request);
        return toTemplateResponse(templateRepository.save(entity));
    }

    @Transactional
    public NutritionTemplateResponse update(UUID id, NutritionTemplateUpsertRequest request) {
        NutritionTemplateJpaEntity entity = templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutrition template not found"));
        apply(entity, request);
        return toTemplateResponse(templateRepository.save(entity));
    }

    @Transactional
    public void delete(UUID id) {
        NutritionTemplateJpaEntity entity = templateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutrition template not found"));
        templateRepository.delete(entity);
    }

    @Transactional
    public NutritionPlanResponse assignTemplate(UUID templateId, AssignNutritionTemplateRequest request) {
        NutritionTemplateJpaEntity template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutrition template not found"));
        UserJpaEntity assignedUser = userRepository.findByEmail(request.assignedMemberEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assigned user not found"));

        NutritionPlanJpaEntity entity = new NutritionPlanJpaEntity();
        entity.setId(UUID.randomUUID());
        entity.setName(template.getName());
        entity.setAssignedUser(assignedUser);
        entity.setGoal(template.getGoal());
        entity.setType(template.getType());
        entity.setCalories(template.getCalories());
        entity.setProtein(template.getProtein());
        entity.setCarbs(template.getCarbs());
        entity.setFat(template.getFat());
        entity.setStatus(request.status().trim());
        entity.setReviewDate(parseDate(request.reviewDate()));
        entity.setActivityLevel(template.getActivityLevel());
        entity.setRestrictions(template.getRestrictions());
        entity.setSupplements(template.getSupplements());
        entity.setTips(template.getTips());
        entity.setSourceTemplateId(template.getId());

        return toPlanResponse(nutritionPlanRepository.save(entity));
    }

    private void apply(NutritionTemplateJpaEntity entity, NutritionTemplateUpsertRequest request) {
        entity.setName(normalizeRequired(request.name()));
        entity.setGoal(normalizeRequired(request.goal()));
        entity.setType(normalizeRequired(request.type()));
        entity.setCalories(request.calories());
        entity.setProtein(request.protein());
        entity.setCarbs(request.carbs());
        entity.setFat(request.fat());
        entity.setActivityLevel(normalizeRequired(request.activityLevel()));
        entity.setRestrictions(blankToNull(request.restrictions()));
        entity.setSupplements(blankToNull(request.supplements()));
        entity.setTips(blankToNull(request.tips()));
        entity.setDescription(blankToNull(request.description()));
        entity.setActive(request.active() == null ? Boolean.TRUE : request.active());
    }

    private NutritionTemplateResponse toTemplateResponse(NutritionTemplateJpaEntity entity) {
        return new NutritionTemplateResponse(
                entity.getId(),
                entity.getName(),
                entity.getGoal(),
                entity.getType(),
                entity.getCalories(),
                entity.getProtein(),
                entity.getCarbs(),
                entity.getFat(),
                entity.getActivityLevel(),
                entity.getRestrictions(),
                entity.getSupplements(),
                entity.getTips(),
                entity.getDescription(),
                entity.getActive()
        );
    }

    private NutritionPlanResponse toPlanResponse(NutritionPlanJpaEntity entity) {
        UserJpaEntity assignedUser = entity.getAssignedUser();
        return new NutritionPlanResponse(
                entity.getId(),
                entity.getName(),
                entity.getGoal(),
                entity.getCalories(),
                entity.getType(),
                entity.getStatus(),
                entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : "",
                entity.getReviewDate() != null ? entity.getReviewDate().toString() : "",
                entity.getActivityLevel(),
                entity.getProtein(),
                entity.getCarbs(),
                entity.getFat(),
                entity.getRestrictions(),
                entity.getSupplements(),
                entity.getTips(),
                assignedUser != null ? assignedUser.getEmail() : "",
                assignedUser != null ? resolveName(assignedUser) : "",
                entity.getSourceTemplateId()
        );
    }

    private String resolveName(UserJpaEntity user) {
        if (user.getName() != null && !user.getName().isBlank()) {
            if (user.getLastName() != null && !user.getLastName().isBlank()) {
                return user.getName() + " " + user.getLastName();
            }
            return user.getName();
        }
        return user.getEmail();
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid review date");
        }
    }

    private String normalizeRequired(String value) {
        return value == null ? "" : value.trim();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
