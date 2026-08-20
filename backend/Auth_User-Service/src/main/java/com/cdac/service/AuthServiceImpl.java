package com.cdac.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.entities.RefreshToken;
import com.cdac.entities.Role;
import com.cdac.entities.User;
import com.cdac.dtos.*;
import com.cdac.daos.*;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final ModelMapper mapper;

    @Value("${app.email-verification-expiry-minutes}")
    private long emailVerificationExpiryMinutes;

    @Value("${app.password-reset-expiry-minutes}")
    private long passwordResetExpiryMinutes;

    @Value("${app.refresh-token-expiry-days}")
    private long refreshTokenExpiryDays;

    @Override
    public AuthResponseDto register(RegisterDto request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Public self-registration must never be able to mint an ADMIN account.
        if (request.getRole() != Role.CANDIDATE && request.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Invalid role for self-registration");
        }

        User user = mapper.map(request, User.class);

        // Password should never be stored directly
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(true);
        user.setEmailVerified(false);
        user.setEmailVerificationToken(UUID.randomUUID().toString());
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(emailVerificationExpiryMinutes));

        User savedUser;
        try {
            // The existsByEmail() check above is not atomic with this insert, so a
            // concurrent registration with the same email can still slip past it —
            // the DB's unique constraint on users.email is the real guarantee here.
            savedUser = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Email already registered");
        }

        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getEmailVerificationToken());

        String token = jwtService.generateToken(savedUser);
        String refreshToken = createRefreshToken(savedUser);

        AuthResponseDto response = mapper.map(savedUser, AuthResponseDto.class);
        response.setToken(token);
        response.setRefreshToken(refreshToken);
        response.setUserId(savedUser.getId());
        response.setMessage("User registered successfully. Please check your email to verify your account.");

        return response;
    }

    @Override
    public AuthResponseDto login(LoginDto request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        String token = jwtService.generateToken(user);
        String refreshToken = createRefreshToken(user);

        AuthResponseDto response = mapper.map(user, AuthResponseDto.class);
        response.setToken(token);
        response.setRefreshToken(refreshToken);
        response.setUserId(user.getId());
        response.setMessage("Login successful");

        return response;
    }

    @Override
    public MessageResponseDto verifyEmail(String token) {

        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification link"));

        if (user.getEmailVerificationTokenExpiry() == null
                || user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired verification link");
        }

        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponseDto("Email verified successfully");
    }

    @Override
    public MessageResponseDto forgotPassword(ForgotPasswordDto request) {

        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            user.setPasswordResetToken(UUID.randomUUID().toString());
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusMinutes(passwordResetExpiryMinutes));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getPasswordResetToken());
        });

        // Identical response whether or not the email exists — never reveal account existence.
        return new MessageResponseDto("If an account with that email exists, a password reset link has been sent.");
    }

    @Override
    public MessageResponseDto resetPassword(ResetPasswordDto request) {

        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        if (user.getPasswordResetTokenExpiry() == null
                || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset link");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);

        // A password reset invalidates every existing session — force re-login everywhere.
        refreshTokenRepository.deleteByUser(user);

        return new MessageResponseDto("Password reset successfully. Please log in with your new password.");
    }

    @Override
    public MessageResponseDto changePassword(Long userId, ChangePasswordDto request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new MessageResponseDto("Password changed successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isEmailVerified(),
                user.isActive()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getUsersByIds(List<Long> userIds) {

        return userRepository.findAllById(userIds).stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole(),
                        user.isEmailVerified(),
                        user.isActive()
                ))
                .toList();
    }

    @Override
    public RefreshTokenResponseDto refreshToken(RefreshTokenRequestDto request) {

        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (storedToken.isRevoked() || storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired or revoked, please log in again");
        }

        User user = storedToken.getUser();

        // Rotate on every use: the old refresh token is single-use.
        refreshTokenRepository.delete(storedToken);

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = createRefreshToken(user);

        return new RefreshTokenResponseDto(newAccessToken, newRefreshToken);
    }

    @Override
    public MessageResponseDto logout(RefreshTokenRequestDto request) {

        // Idempotent: whether or not the token still exists, logout reports success.
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(refreshTokenRepository::delete);

        return new MessageResponseDto("Logged out successfully");
    }

    private String createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(refreshTokenExpiryDays));
        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }
}
