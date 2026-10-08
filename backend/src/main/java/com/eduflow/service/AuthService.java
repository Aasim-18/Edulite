package com.eduflow.service;

import com.eduflow.dto.LoginRequest;
import com.eduflow.dto.LoginResponse;
import com.eduflow.entity.User;
import com.eduflow.exception.InvalidCredentialsException;
import com.eduflow.repository.UserRepository;
import com.eduflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        LoginResponse.UserDto userDto = new LoginResponse.UserDto(
                user.getId(), user.getName(), user.getEmail(), user.getRole().name()
        );
        return new LoginResponse(token, userDto);
    }
}
