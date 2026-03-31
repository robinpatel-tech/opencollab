package com.robintech.backend.repository;

import com.robintech.backend.model.Milestone;
import com.robintech.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByProjectOrderByCreatedAtAsc(Project project);
}
