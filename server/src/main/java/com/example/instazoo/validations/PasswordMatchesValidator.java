package com.example.instazoo.validations;

import com.example.instazoo.annotations.PasswordMatches;
import com.example.instazoo.payload.request.SignupRequest;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext constraintValidatorContext) {
        SignupRequest userSignupRequest = (SignupRequest) obj;
        // Взяли объект, достали пароль и сравнили с заново написанным.
        return userSignupRequest.getPassword().equals(userSignupRequest.getConfirmPassword());
    }
}
