package com.backend.presentation.controller;

import com.backend.application.service.ExerciseLibraryService;
import com.backend.presentation.dto.ExerciseRequest;
import com.backend.presentation.dto.ExerciseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/exercises")
public class ExerciseController {

    private final ExerciseLibraryService exerciseLibraryService;

    @GetMapping
    public ResponseEntity<List<ExerciseResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String muscleGroup,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String exerciseType,
            @RequestParam(required = false) Boolean active
    ) {
        return ResponseEntity.ok(exerciseLibraryService.getAll(search, muscleGroup, equipment, exerciseType, active));
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<ExerciseResponse>> getPage(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String muscleGroup,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) String exerciseType,
            @RequestParam(required = false) Boolean active,
            Pageable pageable
    ) {
        return ResponseEntity.ok(
                exerciseLibraryService.getPage(search, muscleGroup, equipment, exerciseType, active, pageable)
        );
    }

    @PostMapping
    public ResponseEntity<ExerciseResponse> create(@Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(exerciseLibraryService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponse> update(@PathVariable UUID id, @Valid @RequestBody ExerciseRequest request) {
        return ResponseEntity.ok(exerciseLibraryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        exerciseLibraryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
