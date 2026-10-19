package com.foody.ordertracker.service;

import com.foody.ordertracker.dto.LoginRequest;
import com.foody.ordertracker.dto.LoginResponse;
import com.foody.ordertracker.exception.InvalidCredentialsException;
import com.foody.ordertracker.model.User;
import com.foody.ordertracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    private static final String TOKEN = "eyJhbGciOiJIUzI1NiJ9"
            + ".eyJzdWIiOiIxIiwiZW1haWwiOiJmcmVkQGZvb2R5LmNvbSIsImlhdCI6MTc5MjI1MjgwMCwiZXhwIjoxNzkyMjYwMDAwfQ"
            + ".kR3x9Qm2vT7bN1pL8sF4hJ6dW0yC5eA2gU9iO3nZ7tE";

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private TokenService tokenService;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldReturnTokenWhenCredentialsAreValid() {
        User user = user();
        when(userRepository.findByEmail("fred@foody.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senha123", "hash-da-senha")).thenReturn(true);
        when(tokenService.generateToken(user)).thenReturn(TOKEN);

        LoginResponse response = authService.login(new LoginRequest(" Fred@Foody.com ", "senha123"));

        assertThat(response.token()).isEqualTo(TOKEN);
    }

    @Test
    void shouldRejectUnknownEmail() {
        when(userRepository.findByEmail("fred@foody.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("fred@foody.com", "senha123")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void shouldRejectWrongPassword() {
        when(userRepository.findByEmail("fred@foody.com")).thenReturn(Optional.of(user()));
        when(passwordEncoder.matches("senhaErrada", "hash-da-senha")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("fred@foody.com", "senhaErrada")))
                .isInstanceOf(InvalidCredentialsException.class);
        verify(tokenService, never()).generateToken(any());
    }

    private User user() {
        User user = new User();
        user.setId(1L);
        user.setEmail("fred@foody.com");
        user.setPasswordHash("hash-da-senha");
        return user;
    }
}
