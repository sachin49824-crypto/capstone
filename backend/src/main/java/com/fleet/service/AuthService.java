package com.fleet.service;

import com.fleet.dto.LoginRequest;
import com.fleet.dto.LoginResponse;
import com.fleet.dto.RegisterRequest;
import com.fleet.dto.UserDto;
import com.fleet.entity.User;
import com.fleet.repository.UserRepository;
import com.fleet.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole()));
    }

    public LoginResponse register(RegisterRequest request) {
        if (request == null || request.email() == null || request.password() == null || request.name() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email, and password are required");
        }

        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ADMIN");
        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);
        return new LoginResponse(token, new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole()));
    }
}
