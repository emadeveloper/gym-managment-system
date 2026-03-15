package com.backend.presentation.controller;

import com.backend.application.service.RoutineTemplateManagementService;
import com.backend.presentation.dto.AssignRoutineTemplateRequest;
import com.backend.presentation.dto.CloneRoutineTemplateRequest;
import com.backend.presentation.dto.RoutineResponse;
import com.backend.presentation.dto.RoutineTemplateResponse;
import com.backend.presentation.dto.RoutineTemplateUpsertRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/routine-templates")
public class RoutineTemplateController {

    private final RoutineTemplateManagementService routineTemplateManagementService;

    @GetMapping
    public ResponseEntity<List<RoutineTemplateResponse>> getAll() {
        return ResponseEntity.ok(routineTemplateManagementService.getAll());
    }

    @PostMapping
    public ResponseEntity<RoutineTemplateResponse> create(@Valid @RequestBody RoutineTemplateUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routineTemplateManagementService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoutineTemplateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody RoutineTemplateUpsertRequest request
    ) {
        return ResponseEntity.ok(routineTemplateManagementService.update(id, request));
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<RoutineTemplateResponse> cloneTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody CloneRoutineTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routineTemplateManagementService.cloneTemplate(id, request.name()));
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<RoutineResponse> assignTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody AssignRoutineTemplateRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routineTemplateManagementService.assignTemplate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        routineTemplateManagementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
