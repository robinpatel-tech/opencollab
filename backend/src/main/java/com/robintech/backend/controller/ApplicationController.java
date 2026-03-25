package com.robintech.backend.controller;

import com.robintech.backend.dto.ApplicationRequest;
import com.robintech.backend.dto.ApplicationResponse;
import com.robintech.backend.model.Application.ApplicationStatus;
import com.robintech.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // Apply to a project
    @PostMapping("/project/{projectId}")
    public ResponseEntity<ApplicationResponse> apply(
            @PathVariable Long projectId,
            @Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyToProject(projectId, request));
    }

    // Owner: view all applications for a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ApplicationResponse>> getProjectApplications(
            @PathVariable Long projectId) {
        return ResponseEntity.ok(applicationService.getApplicationsForProject(projectId));
    }

    // Applicant: view my applications
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }

    // Owner: accept or reject
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status));
    }

    // Applicant: withdraw application
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<Void> withdraw(@PathVariable Long applicationId) {
        applicationService.withdrawApplication(applicationId);
        return ResponseEntity.noContent().build();
    }
}


/*
POST http://localhost:8080/api/applications/project/1
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "message": "I love this idea! I have 2 years of React experience and would love to contribute.",
  "roleAppliedFor": "Frontend Dev"
}
```

**View applications for your project (as owner):**
```
GET http://localhost:8080/api/applications/project/1
Authorization: Bearer <your_token>
```

**View my sent applications:**
```
GET http://localhost:8080/api/applications/my
Authorization: Bearer <your_token>
```

**Accept an application (as owner):**
```
PATCH http://localhost:8080/api/applications/1/status?status=ACCEPTED
Authorization: Bearer <your_token>
```

**Reject an application:**
```
PATCH http://localhost:8080/api/applications/1/status?status=REJECTED
Authorization: Bearer <your_token>
*/