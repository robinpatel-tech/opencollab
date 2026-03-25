package com.robintech.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_tech_stack", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "tech")
    private List<String> techStack;

    @ElementCollection
    @CollectionTable(name = "project_roles_needed", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "role")
    private List<String> rolesNeeded;

    @Enumerated(EnumType.STRING)
    private CommitmentLevel commitmentLevel;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum CommitmentLevel {
        LOW, MEDIUM, HIGH
    }

    public enum ProjectStatus {
        OPEN, IN_PROGRESS, COMPLETED
    }
}
