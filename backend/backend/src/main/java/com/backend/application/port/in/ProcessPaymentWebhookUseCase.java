package com.backend.application.port.in;

import com.backend.application.port.in.command.ProcessPaymentWebhookCommand;

public interface ProcessPaymentWebhookUseCase {
    void process(ProcessPaymentWebhookCommand command);
}
