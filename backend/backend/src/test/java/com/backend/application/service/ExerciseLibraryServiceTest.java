package com.backend.application.service;

import com.backend.infrastructure.adapter.out.persistence.entity.ExerciseJpaEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataExerciseRepository;
import com.backend.presentation.dto.ExerciseRequest;
import com.backend.presentation.dto.ExerciseResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExerciseLibraryServiceTest {

    @Mock
    private SpringDataExerciseRepository exerciseRepository;

    @InjectMocks
    private ExerciseLibraryService service;

    @Test
    void shouldCreateExerciseWithNormalizedName() {
        when(exerciseRepository.existsByNameIgnoreCase("Press banca con barra")).thenReturn(false);
        when(exerciseRepository.save(any(ExerciseJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExerciseResponse response = service.create(new ExerciseRequest(
                "  Press banca con barra  ",
                "pecho",
                "barra",
                "compuesto",
                "Principal empuje horizontal",
                "Escapulas retraidas",
                "No rebotar barra",
                "https://img.test/banca.png",
                "https://video.test/banca",
                true
        ));

        assertEquals("Press banca con barra", response.name());
        assertEquals("Pecho", response.muscleGroup());
        assertEquals("Barra", response.equipment());
    }

    @Test
    void shouldRejectDuplicatedExerciseName() {
        when(exerciseRepository.existsByNameIgnoreCase("Press banca con barra")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> service.create(new ExerciseRequest(
                "Press banca con barra",
                "Pecho",
                "Barra",
                "Compuesto",
                "desc",
                "cues",
                null,
                null,
                null,
                true
        )));
    }

    @Test
    void shouldUpdateExerciseWithoutBreakingExistingFields() {
        UUID exerciseId = UUID.randomUUID();
        ExerciseJpaEntity existing = new ExerciseJpaEntity();
        existing.setId(exerciseId);
        existing.setName("Press inclinado");
        existing.setMuscleGroup("Pecho");
        existing.setEquipment("Barra");
        existing.setExerciseType("Compuesto");
        existing.setDescription("desc");
        existing.setInstructions("cues");
        existing.setActive(true);

        when(exerciseRepository.findById(exerciseId)).thenReturn(Optional.of(existing));
        when(exerciseRepository.save(any(ExerciseJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        service.update(exerciseId, new ExerciseRequest(
                "Press inclinado mancuernas",
                "Pecho",
                "Mancuernas",
                "Compuesto",
                "Desc",
                "Cues",
                null,
                null,
                null,
                true
        ));

        ArgumentCaptor<ExerciseJpaEntity> captor = ArgumentCaptor.forClass(ExerciseJpaEntity.class);
        verify(exerciseRepository).save(captor.capture());
        assertEquals("Press inclinado mancuernas", captor.getValue().getName());
        assertEquals("Mancuernas", captor.getValue().getEquipment());
    }

    @Test
    void shouldFilterExercisesBySearchAndMuscleGroup() {
        ExerciseJpaEntity first = new ExerciseJpaEntity();
        first.setId(UUID.randomUUID());
        first.setName("Press banca");
        first.setMuscleGroup("Pecho");
        first.setEquipment("Barra");
        first.setExerciseType("Compuesto");
        first.setDescription("desc");
        first.setInstructions("cues");
        first.setActive(true);

        ExerciseJpaEntity second = new ExerciseJpaEntity();
        second.setId(UUID.randomUUID());
        second.setName("Curl barra");
        second.setMuscleGroup("Biceps");
        second.setEquipment("Barra");
        second.setExerciseType("Aislado");
        second.setDescription("desc");
        second.setInstructions("cues");
        second.setActive(true);

        when(exerciseRepository.findAll()).thenReturn(List.of(first, second));

        List<ExerciseResponse> result = service.getAll("press", "pecho", null, null, true);

        assertEquals(1, result.size());
        assertEquals("Press banca", result.get(0).name());
    }
}

