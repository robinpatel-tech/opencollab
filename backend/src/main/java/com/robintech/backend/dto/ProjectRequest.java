package com.robintech.backend.dto;
import com.robintech.backend.model.Project.CommitmentLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class ProjectRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private List<String> techStack;

    private List<String> rolesNeeded;

    @NotNull
    private CommitmentLevel commitmentLevel;
}