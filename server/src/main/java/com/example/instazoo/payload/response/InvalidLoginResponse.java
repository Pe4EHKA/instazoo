package com.example.instazoo.payload.response;

import lombok.Getter;



@Getter
public class InvalidLoginResponse {

    private String username;
    private String password;

// После ошибки аутентификации (411) пользователь будет получать эти строки

    public InvalidLoginResponse() {
        this.username = "Invalid Username";
        this.password = "Invalid Password";
    }
}
