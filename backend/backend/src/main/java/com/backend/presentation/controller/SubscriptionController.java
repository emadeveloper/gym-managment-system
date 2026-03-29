package com.backend.presentation.controller;

import com.backend.application.port.in.GetMySubscriptionStatusUseCase;
import com.backend.application.port.in.StartSubscriptionCheckoutUseCase;
import com.backend.application.port.in.command.StartSubscriptionCheckoutCommand;
import com.backend.presentation.dto.CreateSubscriptionCheckoutRequest;
import com.backend.presentation.dto.SubscriptionCheckoutResponse;
import com.backend.presentation.dto.SubscriptionStatusResponse;
import com.backend.presentation.mapper.SubscriptionPresentationMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/billing/subscriptions")
public class SubscriptionController {

    private final StartSubscriptionCheckoutUseCase startSubscriptionCheckoutUseCase;
    private final GetMySubscriptionStatusUseCase getMySubscriptionStatusUseCase;
    private final SubscriptionPresentationMapper mapper;

    @PostMapping("/checkout")
    public ResponseEntity<SubscriptionCheckoutResponse> startCheckout(
            Authentication authentication,
            @Valid @RequestBody(required = false) CreateSubscriptionCheckoutRequest request
    ) {
        SubscriptionCheckoutResponse response = mapper.toResponse(
                startSubscriptionCheckoutUseCase.startCheckout(
                        new StartSubscriptionCheckoutCommand(
                                authentication.getName(),
                                request != null ? request.planCode() : null
                        )
                )
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<SubscriptionStatusResponse> getMySubscriptionStatus(Authentication authentication) {
        return ResponseEntity.ok(
                mapper.toResponse(getMySubscriptionStatusUseCase.getMySubscriptionStatus(authentication.getName()))
        );
    }
}
