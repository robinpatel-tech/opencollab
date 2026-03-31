package com.robintech.backend.repository;

import com.robintech.backend.model.Application;
import com.robintech.backend.model.Project;
import com.robintech.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByProject(Project project);
    
    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.project p " +
           "JOIN FETCH a.applicant u " +
           "WHERE p.owner = :owner")
    List<Application> findByProjectOwner(@Param("owner") User owner);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.project p " +
           "JOIN FETCH a.applicant u " +
           "WHERE a.applicant = :applicant")
    List<Application> findByApplicant(@Param("applicant") User applicant);

    Optional<Application> findByProjectAndApplicant(Project project, User applicant);

    boolean existsByProjectAndApplicant(Project project, User applicant);
}