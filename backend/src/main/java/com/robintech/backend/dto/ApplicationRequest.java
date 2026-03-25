package com.robintech.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationRequest {

    @NotBlank
    private String message;

    private String roleAppliedFor;
}
