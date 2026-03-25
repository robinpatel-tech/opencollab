package com.robintech.backend.dto;
import com.robintech.backend.model.Project;
import com.robintech.backend.model.Project.CommitmentLevel;
import com.robintech.backend.model.Project.ProjectStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> techStack;
    private List<String> rolesNeeded;
    private CommitmentLevel commitmentLevel;
    private ProjectStatus status;
    private Long ownerId;
    private String ownerUsername;
    private LocalDateTime createdAt;

    public static ProjectResponse fromEntity(Project project) {
        ProjectResponse res = new ProjectResponse();
        res.setId(project.getId());
        res.setTitle(project.getTitle());
        res.setDescription(project.getDescription());
        res.setTechStack(project.getTechStack());
        res.setRolesNeeded(project.getRolesNeeded());
        res.setCommitmentLevel(project.getCommitmentLevel());
        res.setStatus(project.getStatus());
        res.setOwnerId(project.getOwner().getId());
        res.setOwnerUsername(project.getOwner().getUsername());
        res.setCreatedAt(project.getCreatedAt());
        return res;
    }
}