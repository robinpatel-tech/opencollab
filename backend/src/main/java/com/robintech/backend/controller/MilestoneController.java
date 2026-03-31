package com.robintech.backend.controller;

import com.robintech.backend.model.Milestone;
import com.robintech.backend.service.MilestoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneService milestoneService;

    @GetMapping("/projects/{projectId}/milestones")
    public List<Milestone> getMilestones(@PathVariable Long projectId) {
        return milestoneService.getMilestones(projectId);
    }

    @PostMapping("/projects/{projectId}/milestones")
    public Milestone createMilestone(@PathVariable Long projectId, @RequestBody Milestone milestone) {
        return milestoneService.createMilestone(projectId, milestone);
    }

    @PatchMapping("/milestones/{milestoneId}")
    public Milestone updateMilestone(@PathVariable Long milestoneId, @RequestBody Milestone milestone) {
        return milestoneService.updateMilestone(milestoneId, milestone);
    }

    @DeleteMapping("/milestones/{milestoneId}")
    public void deleteMilestone(@PathVariable Long milestoneId) {
        milestoneService.deleteMilestone(milestoneId);
    }
}
