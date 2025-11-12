package com.backend.infrastructure.adapter.out.mail;

import com.backend.application.port.out.NotificationPort;
import com.backend.domain.valueobject.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class NotificationAdapter implements NotificationPort {
    @Override
    public void sendWelcomeEmail(Email email, String message) {
        // TODO: implement JavaMailSender or SendGrid for Real Email notification
      log.info("📨 Sending welcome email to {}: {}", email.getValue(), message);
    }
}
