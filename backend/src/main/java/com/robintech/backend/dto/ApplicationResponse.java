package com.robintech.backend.dto;
import com.robintech.backend.model.Application;
import com.robintech.backend.model.Application.ApplicationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long applicantId;
    private String applicantUsername;
    private String message;
    private String roleAppliedFor;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    public static ApplicationResponse fromEntity(Application app) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setProjectId(app.getProject().getId());
        res.setProjectTitle(app.getProject().getTitle());
        res.setApplicantId(app.getApplicant().getId());
        res.setApplicantUsername(app.getApplicant().getUsername());
        res.setMessage(app.getMessage());
        res.setRoleAppliedFor(app.getRoleAppliedFor());
        res.setStatus(app.getStatus());
        res.setAppliedAt(app.getAppliedAt());
        return res;
    }
}
