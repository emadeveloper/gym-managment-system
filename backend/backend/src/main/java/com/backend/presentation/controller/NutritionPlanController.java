package com.backend.presentation.controller;

import com.backend.application.service.NutritionPlanManagementService;
import com.backend.presentation.dto.NutritionPlanRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/nutrition-plans")
public class NutritionPlanController {

    private final NutritionPlanManagementService nutritionPlanManagementService;

    @GetMapping
    public ResponseEntity<List<NutritionPlanResponse>> getAll() {
        return ResponseEntity.ok(nutritionPlanManagementService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<NutritionPlanResponse>> getMine(Authentication authentication) {
        return ResponseEntity.ok(nutritionPlanManagementService.getForUser(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<NutritionPlanResponse> create(@Valid @RequestBody NutritionPlanRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nutritionPlanManagementService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NutritionPlanResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody NutritionPlanRequest request
    ) {
        return ResponseEntity.ok(nutritionPlanManagementService.update(id, request));
    }
}
