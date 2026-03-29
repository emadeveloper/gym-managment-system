package com.backend.presentation.controller;

import com.backend.application.port.in.ProcessPaymentWebhookUseCase;
import com.backend.application.port.in.command.ProcessPaymentWebhookCommand;
import com.backend.presentation.dto.MercadoPagoWebhookRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/billing/webhooks/mercadopago")
public class MercadoPagoWebhookController {

    private final ProcessPaymentWebhookUseCase processPaymentWebhookUseCase;

    @PostMapping
    public ResponseEntity<Void> processWebhook(
            @RequestBody(required = false) MercadoPagoWebhookRequest request,
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId
    ) {
        processPaymentWebhookUseCase.process(new ProcessPaymentWebhookCommand(
                request != null ? request.id() : null,
                request != null ? request.type() : null,
                request != null ? request.action() : null,
                request != null && request.data() != null ? request.data().id() : null,
                xSignature,
                xRequestId
        ));

        return ResponseEntity.ok().build();
    }
}
