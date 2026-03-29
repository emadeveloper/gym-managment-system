package com.backend.application.port.in.command;

public record ProcessPaymentWebhookCommand(
        String notificationId,
        String topic,
        String action,
        String dataId,
        String xSignature,
        String xRequestId
) {
}
