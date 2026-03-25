package com.robintech.backend.service;


import com.robintech.backend.dto.ApplicationRequest;
import com.robintech.backend.dto.ApplicationResponse;
import com.robintech.backend.model.Application;
import com.robintech.backend.model.Application.ApplicationStatus;
import com.robintech.backend.model.Project;
import com.robintech.backend.model.User;
import com.robintech.backend.repository.ApplicationRepository;
import com.robintech.backend.repository.ProjectRepository;
import com.robintech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ApplicationResponse applyToProject(Long projectId, ApplicationRequest request) {
        User applicant = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (project.getOwner().getId().equals(applicant.getId()))
            throw new RuntimeException("You cannot apply to your own project");

        if (applicationRepository.existsByProjectAndApplicant(project, applicant))
            throw new RuntimeException("You have already applied to this project");

        if (project.getStatus() != Project.ProjectStatus.OPEN)
            throw new RuntimeException("This project is not accepting applications");

        Application application = new Application();
        application.setProject(project);
        application.setApplicant(applicant);
        application.setMessage(request.getMessage());
        application.setRoleAppliedFor(request.getRoleAppliedFor());

        return ApplicationResponse.fromEntity(applicationRepository.save(application));
    }

    // Project owner sees all applications for their project
    public List<ApplicationResponse> getApplicationsForProject(Long projectId) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized to view these applications");

        return applicationRepository.findByProject(project)
                .stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Applicant sees all their own applications
    public List<ApplicationResponse> getMyApplications() {
        User currentUser = getCurrentUser();
        return applicationRepository.findByApplicant(currentUser)
                .stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Owner accepts or rejects an application
    public ApplicationResponse updateApplicationStatus(Long applicationId,
                                                       ApplicationStatus status) {
        User currentUser = getCurrentUser();
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getProject().getOwner().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized to update this application");

        application.setStatus(status);
        return ApplicationResponse.fromEntity(applicationRepository.save(application));
    }

    // Applicant withdraws their own application
    public void withdrawApplication(Long applicationId) {
        User currentUser = getCurrentUser();
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getApplicant().getId().equals(currentUser.getId()))
            throw new RuntimeException("Not authorized to withdraw this application");

        applicationRepository.delete(application);
    }
}