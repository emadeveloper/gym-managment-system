package com.backend.presentation.controller;

import com.backend.application.service.RoutineManagementService;
import com.backend.presentation.dto.RoutineRequest;
import com.backend.presentation.dto.RoutineResponse;
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
@RequestMapping("api/v1/routines")
public class RoutineController {

    private final RoutineManagementService routineManagementService;

    @GetMapping
    public ResponseEntity<List<RoutineResponse>> getAll() {
        return ResponseEntity.ok(routineManagementService.getAll());
    }

    @GetMapping("/my")
    public ResponseEntity<List<RoutineResponse>> getMine(Authentication authentication) {
        return ResponseEntity.ok(routineManagementService.getForUser(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<RoutineResponse> create(@Valid @RequestBody RoutineRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(routineManagementService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoutineResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody RoutineRequest request
    ) {
        return ResponseEntity.ok(routineManagementService.update(id, request));
    }
}
