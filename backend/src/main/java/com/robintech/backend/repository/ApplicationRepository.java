package com.robintech.backend.repository;

import com.robintech.backend.model.Application;
import com.robintech.backend.model.Project;
import com.robintech.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByProject(Project project);

    List<Application> findByApplicant(User applicant);

    Optional<Application> findByProjectAndApplicant(Project project, User applicant);

    boolean existsByProjectAndApplicant(Project project, User applicant);
}