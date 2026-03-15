package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataExerciseRepository;
import com.backend.presentation.dto.ExerciseRequest;
import com.backend.presentation.dto.ExerciseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExerciseLibraryService {

    private final SpringDataExerciseRepository exerciseRepository;

    @Transactional(readOnly = true)
    public List<ExerciseResponse> getAll(
            String search,
            String muscleGroup,
            String equipment,
            String exerciseType,
            Boolean active
    ) {
        return filterExercises(search, muscleGroup, equipment, exerciseType, active);
    }

    @Transactional(readOnly = true)
    public Page<ExerciseResponse> getPage(
            String search,
            String muscleGroup,
            String equipment,
            String exerciseType,
            Boolean active,
            Pageable pageable
    ) {
        List<ExerciseResponse> filtered = filterExercises(search, muscleGroup, equipment, exerciseType, active);
        int fromIndex = Math.min((int) pageable.getOffset(), filtered.size());
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), filtered.size());
        return new PageImpl<>(filtered.subList(fromIndex, toIndex), pageable, filtered.size());
    }

    private List<ExerciseResponse> filterExercises(
            String search,
            String muscleGroup,
            String equipment,
            String exerciseType,
            Boolean active
    ) {
        String normalizedSearch = normalize(search);
        String normalizedMuscleGroup = normalize(muscleGroup);
        String normalizedEquipment = normalize(equipment);
        String normalizedExerciseType = normalize(exerciseType);

        return exerciseRepository.findAll()
                .stream()
                .filter(entity -> normalizedSearch == null || entity.getName().toLowerCase(Locale.ROOT).contains(normalizedSearch))
                .filter(entity -> normalizedMuscleGroup == null || entity.getMuscleGroup().toLowerCase(Locale.ROOT).equals(normalizedMuscleGroup))
                .filter(entity -> normalizedEquipment == null || entity.getEquipment().toLowerCase(Locale.ROOT).equals(normalizedEquipment))
                .filter(entity -> normalizedExerciseType == null || entity.getExerciseType().toLowerCase(Locale.ROOT).equals(normalizedExerciseType))
                .filter(entity -> active == null || active.equals(entity.getActive()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExerciseResponse create(ExerciseRequest request) {
        String name = normalizeRequired(request.name());
        if (exerciseRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Exercise name already exists");
        }

        ExerciseJpaEntity entity = new ExerciseJpaEntity();
        entity.setId(UUID.randomUUID());
        apply(entity, request);
        return toResponse(exerciseRepository.save(entity));
    }

    @Transactional
    public ExerciseResponse update(UUID id, ExerciseRequest request) {
        ExerciseJpaEntity entity = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        String nextName = normalizeRequired(request.name());
        if (!entity.getName().equalsIgnoreCase(nextName) && exerciseRepository.existsByNameIgnoreCase(nextName)) {
            throw new IllegalArgumentException("Exercise name already exists");
        }

        apply(entity, request);
        return toResponse(exerciseRepository.save(entity));
    }

    @Transactional
    public void delete(UUID id) {
        ExerciseJpaEntity entity = exerciseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
        exerciseRepository.delete(entity);
    }

    private void apply(ExerciseJpaEntity entity, ExerciseRequest request) {
        String name = normalizeRequired(request.name());
        entity.setName(name);
        entity.setSlug(slugify(name));
        entity.setMuscleGroup(toTitleCase(normalizeRequired(request.muscleGroup())));
        entity.setEquipment(toTitleCase(normalizeRequired(request.equipment())));
        entity.setExerciseType(toTitleCase(normalizeRequired(request.exerciseType())));
        entity.setDescription(normalizeRequired(request.description()));
        entity.setInstructions(normalizeRequired(request.instructions()));
        entity.setCommonMistakes(blankToNull(request.commonMistakes()));
        entity.setThumbnailUrl(blankToNull(request.thumbnailUrl()));
        entity.setVideoUrl(blankToNull(request.videoUrl()));
        entity.setActive(request.active() == null ? Boolean.TRUE : request.active());
    }

    private ExerciseResponse toResponse(ExerciseJpaEntity entity) {
        return new ExerciseResponse(
                entity.getId(),
                entity.getName(),
                entity.getSlug(),
                entity.getMuscleGroup(),
                entity.getEquipment(),
                entity.getExerciseType(),
                entity.getDescription(),
                entity.getInstructions(),
                entity.getCommonMistakes(),
                entity.getThumbnailUrl(),
                entity.getVideoUrl(),
                entity.getActive()
        );
    }

    private String slugify(String value) {
        return value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }

    private String toTitleCase(String value) {
        String[] words = value.trim().toLowerCase(Locale.ROOT).split("\\s+");
        StringBuilder builder = new StringBuilder();
        for (String word : words) {
            if (word.isBlank()) {
                continue;
            }
            if (!builder.isEmpty()) {
                builder.append(' ');
            }
            builder.append(Character.toUpperCase(word.charAt(0)));
            if (word.length() > 1) {
                builder.append(word.substring(1));
            }
        }
        return builder.toString();
    }

    private String normalizeRequired(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Required field is missing");
        }
        return value.trim();
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
