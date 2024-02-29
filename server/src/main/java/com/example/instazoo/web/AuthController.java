package com.example.instazoo.web;

import com.example.instazoo.payload.request.LoginRequest;
import com.example.instazoo.payload.request.SignupRequest;
import com.example.instazoo.payload.response.JWTTokenSuccessResponse;
import com.example.instazoo.payload.response.MessageResponse;
import com.example.instazoo.security.JWTTokenProvider;
import com.example.instazoo.security.SecurityConstants;
import com.example.instazoo.services.UserService;
import com.example.instazoo.validations.ResponseErrorValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.ObjectUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


// Контроллер отвечает за афторизацию пользователя.
@CrossOrigin
@RestController
@RequestMapping("/api/auth")
@PreAuthorize("permitAll()")
public class AuthController {

    @Autowired
    private JWTTokenProvider jwtTokenProvider;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private ResponseErrorValidation responseErrorValidation;
    @Autowired
    private UserService userService;


    // При авторизации мы получаем объект LoginRequest и делаем валидацию, есть ли ошибку у этого объекта.
    @PostMapping("/signin")
    public ResponseEntity<Object> authenticateUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        ResponseEntity<Object> errors = responseErrorValidation.mapValidationService(bindingResult);
        if (!ObjectUtils.isEmpty(errors)) return errors;
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        ));
        // Если ошибок нету, то мы задаем SecurityContext нашему приложению
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // Генерируем токен, задаем туда все данные user и передаем его на клиент Angular.
        String jwt = SecurityConstants.TOKEN_PREFIX + jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JWTTokenSuccessResponse(true, jwt));
    }

    // Когда пользователь регистрируется
    //api/auth/signup присылаем сюда объект

    // Когда пользователь пытается зарегистрироваться, он передает объект SignupRequest, который мы создали.
    @PostMapping("/signup")
    public ResponseEntity<Object> registerUser(@Valid @RequestBody SignupRequest signupRequest, BindingResult bindingResult) {
        ResponseEntity<Object> errors = responseErrorValidation.mapValidationService(bindingResult);
        if (!ObjectUtils.isEmpty(errors)) return errors;
        // Если у нас нету никаких ошибок, создаем пользователя. Именно UserService сохраняет пользователя в базу данных.
        userService.createUser(signupRequest);
        return ResponseEntity.ok(new MessageResponse("User registered successfully"));
    }

}
