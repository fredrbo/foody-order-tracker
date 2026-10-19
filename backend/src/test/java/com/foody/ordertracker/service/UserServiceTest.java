package com.foody.ordertracker.service;

import com.foody.ordertracker.dto.UserRequest;
import com.foody.ordertracker.dto.UserResponse;
import com.foody.ordertracker.exception.EmailAlreadyRegisteredException;
import com.foody.ordertracker.model.User;
import com.foody.ordertracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldCreateUserWithNormalizedEmailAndEncodedPassword() {
        UserRequest request = new UserRequest(" Fred ", " Fred@Foody.com ", "senha123");
        when(userRepository.existsByEmail("fred@foody.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("hash-da-senha");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.create(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();
        assertThat(saved.getName()).isEqualTo("Fred");
        assertThat(saved.getEmail()).isEqualTo("fred@foody.com");
        assertThat(saved.getPasswordHash()).isEqualTo("hash-da-senha");
        assertThat(response.email()).isEqualTo("fred@foody.com");
    }

    @Test
    void shouldRejectEmailAlreadyRegistered() {
        when(userRepository.existsByEmail("fred@foody.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.create(new UserRequest("Fred", "fred@foody.com", "senha123")))
                .isInstanceOf(EmailAlreadyRegisteredException.class);
        verify(userRepository, never()).save(any());
    }
}
