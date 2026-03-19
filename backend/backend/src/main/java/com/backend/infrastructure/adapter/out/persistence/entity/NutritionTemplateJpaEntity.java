package com.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "nutrition_templates")
@Getter
@Setter
@NoArgsConstructor
public class NutritionTemplateJpaEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 180)
    private String name;

    @Column(nullable = false, length = 160)
    private String goal;

    @Column(nullable = false, length = 120)
    private String type;

    @Column(nullable = false)
    private Integer calories;

    @Column(name = "activity_level", nullable = false, length = 120)
    private String activityLevel;

    @Column(nullable = false)
    private Integer protein;

    @Column(nullable = false)
    private Integer carbs;

    @Column(nullable = false)
    private Integer fat;

    @Column(columnDefinition = "TEXT")
    private String restrictions;

    @Column(columnDefinition = "TEXT")
    private String supplements;

    @Column(columnDefinition = "TEXT")
    private String tips;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
