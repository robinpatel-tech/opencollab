package com.robintech.backend.service;

import com.robintech.backend.model.Milestone;
import com.robintech.backend.model.Project;
import com.robintech.backend.model.User;
import com.robintech.backend.repository.MilestoneRepository;
import com.robintech.backend.repository.ProjectRepository;
import com.robintech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Milestone> getMilestones(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return milestoneRepository.findByProjectOrderByCreatedAtAsc(project);
    }

    public Milestone createMilestone(Long projectId, Milestone milestone) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only project owner can create milestones");
        }

        milestone.setProject(project);
        return milestoneRepository.save(milestone);
    }

    public Milestone updateMilestone(Long milestoneId, Milestone milestoneData) {
        User currentUser = getCurrentUser();
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        if (!milestone.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only project owner can update milestones");
        }

        if (milestoneData.getTitle() != null) milestone.setTitle(milestoneData.getTitle());
        if (milestoneData.getDescription() != null) milestone.setDescription(milestoneData.getDescription());
        milestone.setCompleted(milestoneData.isCompleted());
        if (milestoneData.getDueDate() != null) milestone.setDueDate(milestoneData.getDueDate());

        return milestoneRepository.save(milestone);
    }

    public void deleteMilestone(Long milestoneId) {
        User currentUser = getCurrentUser();
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));

        if (!milestone.getProject().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only project owner can delete milestones");
        }

        milestoneRepository.delete(milestone);
    }
}
