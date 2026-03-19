package com.backend.presentation.controller;

import com.backend.application.service.NutritionTemplateManagementService;
import com.backend.presentation.dto.AssignNutritionTemplateRequest;
import com.backend.presentation.dto.NutritionPlanResponse;
import com.backend.presentation.dto.NutritionTemplateResponse;
import com.backend.presentation.dto.NutritionTemplateUpsertRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("api/v1/nutrition-templates")
public class NutritionTemplateController {

    private final NutritionTemplateManagementService nutritionTemplateManagementService;

    @GetMapping
    public ResponseEntity<List<NutritionTemplateResponse>> getAll() {
        return ResponseEntity.ok(nutritionTemplateManagementService.getAll());
    }

    @PostMapping
    public ResponseEntity<NutritionTemplateResponse> create(@Valid @RequestBody NutritionTemplateUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nutritionTemplateManagementService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NutritionTemplateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody NutritionTemplateUpsertRequest request
    ) {
        return ResponseEntity.ok(nutritionTemplateManagementService.update(id, request));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<NutritionPlanResponse> assignTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody AssignNutritionTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nutritionTemplateManagementService.assignTemplate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        nutritionTemplateManagementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
