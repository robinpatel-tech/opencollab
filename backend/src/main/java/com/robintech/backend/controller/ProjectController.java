package com.robintech.backend.controller;


import com.robintech.backend.dto.ProjectRequest;
import com.robintech.backend.dto.ProjectResponse;
import com.robintech.backend.model.Project;
import com.robintech.backend.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects(
            @RequestParam(required = false) String tech,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Project.CommitmentLevel commitment) {
        return ResponseEntity.ok(projectService.getAllOpenProjects(tech, role, commitment));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }
}


//POST http://localhost:8080/api/projects
//Authorization: Bearer <your_token>
//Content-Type: application/json
//
//{
//    "title": "OpenCollab itself",
//        "description": "Building a platform for developers to find project teammates",
//        "techStack": ["React", "Spring Boot", "MySQL"],
//    "rolesNeeded": ["Frontend Dev", "UI Designer"],
//    "commitmentLevel": "MEDIUM"
//}
//```
//
//        **Get all open projects (with optional filters):**
//        ```
//        GET http://localhost:8080/api/projects
//        GET http://localhost:8080/api/projects?tech=React
//        GET http://localhost:8080/api/projects?commitment=MEDIUM
//        Authorization: Bearer <your_token>
//        ```
//
//        **Get my projects:**
//        ```
//        GET http://localhost:8080/api/projects/my
//        Authorization: Bearer <your_token>