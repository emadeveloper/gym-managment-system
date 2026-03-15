package com.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "routine_template_exercises")
@Getter
@Setter
@NoArgsConstructor
public class RoutineTemplateExerciseJpaEntity {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "routine_template_day_id", nullable = false)
    private RoutineTemplateDayJpaEntity routineTemplateDay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private ExerciseJpaEntity exercise;

    @Column(name = "exercise_name", nullable = false, length = 180)
    private String exerciseName;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "target_sets")
    private Integer targetSets;

    @Column(name = "target_reps")
    private Integer targetReps;

    @Column(name = "target_rep_range_min")
    private Integer targetRepRangeMin;

    @Column(name = "target_rep_range_max")
    private Integer targetRepRangeMax;

    @Column(name = "suggested_weight", length = 120)
    private String suggestedWeight;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "coach_notes", columnDefinition = "TEXT")
    private String coachNotes;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

