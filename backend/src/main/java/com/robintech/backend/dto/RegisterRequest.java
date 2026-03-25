package com.robintech.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class RegisterRequest {
    @NotNull
    private String username;

    @Email
    @NotNull
    private String email;

    @NotNull
    @Size(min = 6, message = "password must be at least 6 characters")
    private String password;
}
