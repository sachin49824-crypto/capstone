package com.fleet.service;

import com.fleet.dto.LoginRequest;
import com.fleet.dto.LoginResponse;
import com.fleet.entity.User;
import com.fleet.repository.UserRepository;
import com.fleet.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setName("Fleet Admin");
        sampleUser.setEmail("admin@fleet.com");
        sampleUser.setPassword("encodedPassword");
        sampleUser.setRole("ADMIN");
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest("admin@fleet.com", "admin123");

        when(userRepository.findByEmail("admin@fleet.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("admin123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(sampleUser)).thenReturn("mock-jwt-token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.token());
        assertEquals("admin@fleet.com", response.user().email());
        assertEquals("ADMIN", response.user().role());
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        LoginRequest request = new LoginRequest("unknown@fleet.com", "pass");
        when(userRepository.findByEmail("unknown@fleet.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> authService.login(request));
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = new LoginRequest("admin@fleet.com", "wrongpass");
        when(userRepository.findByEmail("admin@fleet.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpass", "encodedPassword")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> authService.login(request));
    }

    @Test
    void login_NullRequest_ThrowsException() {
        assertThrows(ResponseStatusException.class, () -> authService.login(null));
    }
}
