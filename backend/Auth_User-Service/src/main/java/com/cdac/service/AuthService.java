package com.cdac.service;

import java.util.List;

import com.cdac.dtos.*;

public interface AuthService {

	AuthResponseDto register(RegisterDto request);

    AuthResponseDto login(LoginDto request);

    MessageResponseDto verifyEmail(String token);

    MessageResponseDto forgotPassword(ForgotPasswordDto request);

    MessageResponseDto resetPassword(ResetPasswordDto request);

    MessageResponseDto changePassword(Long userId, ChangePasswordDto request);

    UserResponseDto getCurrentUser(Long userId);

    List<UserResponseDto> getUsersByIds(List<Long> userIds);

    RefreshTokenResponseDto refreshToken(RefreshTokenRequestDto request);

    MessageResponseDto logout(RefreshTokenRequestDto request);
}
