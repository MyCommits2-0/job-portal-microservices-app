package com.cdac.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Override
    public void sendVerificationEmail(String toEmail, String token) {
        String link = frontendBaseUrl + "/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify your email — Job Portal");
        message.setText(
                "Welcome to Job Portal!\n\n" +
                "Please verify your email by opening the link below:\n" + link + "\n\n" +
                "This link expires in 24 hours. If you did not create this account, you can ignore this email."
        );

        send(message);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = frontendBaseUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset your password — Job Portal");
        message.setText(
                "We received a request to reset your password.\n\n" +
                "Open the link below to choose a new password:\n" + link + "\n\n" +
                "This link expires in 30 minutes. If you did not request this, you can ignore this email."
        );

        send(message);
    }

    // Mail credentials are filled in manually after this feature ships (see application.yml),
    // so sending failures must not break the register/forgot-password flow itself.
    private void send(SimpleMailMessage message) {
        try {
            mailSender.send(message);
        } catch (MailException e) {
            log.warn("Failed to send email to {}: {}", message.getTo(), e.getMessage());
        }
    }
}
