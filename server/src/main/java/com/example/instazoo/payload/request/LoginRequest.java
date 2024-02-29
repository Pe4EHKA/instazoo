package com.example.instazoo.payload.request;


import lombok.Data;

import javax.validation.constraints.NotEmpty;

// Объект, который мы будем передавать насервер при авторизации.
// Объект авторизации.
@Data
public class LoginRequest {
    @NotEmpty(message = "Username cannot be empty")
    private String username;
    @NotEmpty(message = "Password cannot be empty")
    private String password;
}
