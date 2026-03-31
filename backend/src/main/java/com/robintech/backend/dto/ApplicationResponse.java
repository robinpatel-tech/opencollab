package com.robintech.backend.dto;
import com.robintech.backend.model.Application;
import com.robintech.backend.model.Application.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long applicantId;
    private String applicantUsername;
    private Long ownerId;
    private String ownerUsername;
    private String message;
    private String roleAppliedFor;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public static ApplicationResponse fromEntity(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .projectId(app.getProject().getId())
                .projectTitle(app.getProject().getTitle())
                .applicantId(app.getApplicant().getId())
                .applicantUsername(app.getApplicant().getUsername())
                .ownerId(app.getProject().getOwner().getId())
                .ownerUsername(app.getProject().getOwner().getUsername())
                .message(app.getMessage())
                .roleAppliedFor(app.getRoleAppliedFor())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
