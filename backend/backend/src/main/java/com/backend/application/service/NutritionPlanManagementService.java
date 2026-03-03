package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.NutritionPlanJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.entity.UserJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataNutritionPlanRepository;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.presentation.dto.NutritionPlanRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
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
public class NutritionPlanManagementService {

    private final SpringDataNutritionPlanRepository nutritionPlanRepository;
    private final SpringDataUserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NutritionPlanResponse> getAll() {
        return nutritionPlanRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NutritionPlanResponse> getForUser(String email) {
        return nutritionPlanRepository.findAllByAssignedUserEmailIgnoreCase(email)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NutritionPlanResponse create(NutritionPlanRequest request) {
        NutritionPlanJpaEntity entity = new NutritionPlanJpaEntity();
        entity.setId(UUID.randomUUID());
        apply(entity, request);
        return toResponse(nutritionPlanRepository.save(entity));
    }

    @Transactional
    public NutritionPlanResponse update(UUID id, NutritionPlanRequest request) {
        NutritionPlanJpaEntity entity = nutritionPlanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nutrition plan not found"));
        apply(entity, request);
        return toResponse(nutritionPlanRepository.save(entity));
    }

    private void apply(NutritionPlanJpaEntity entity, NutritionPlanRequest request) {
        UserJpaEntity assignedUser = userRepository.findByEmail(request.assignedMemberEmail().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assigned user not found"));

        entity.setName(request.name().trim());
        entity.setAssignedUser(assignedUser);
        entity.setGoal(request.goal().trim());
        entity.setCalories(request.calories());
        entity.setType(request.type().trim());
        entity.setStatus(request.status().trim());
        entity.setReviewDate(parseDate(request.reviewDate()));
        entity.setActivityLevel(request.activityLevel().trim());
        entity.setProtein(request.protein());
        entity.setCarbs(request.carbs());
        entity.setFat(request.fat());
        entity.setRestrictions(blankToNull(request.restrictions()));
        entity.setSupplements(blankToNull(request.supplements()));
        entity.setTips(blankToNull(request.tips()));
    }

    private NutritionPlanResponse toResponse(NutritionPlanJpaEntity entity) {
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
                assignedUser != null ? resolveName(assignedUser) : ""
        );
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

    private String resolveName(UserJpaEntity user) {
        if (user.getName() != null && !user.getName().isBlank()) {
            if (user.getLastName() != null && !user.getLastName().isBlank()) {
                return user.getName() + " " + user.getLastName();
            }
            return user.getName();
        }
        return user.getEmail();
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
