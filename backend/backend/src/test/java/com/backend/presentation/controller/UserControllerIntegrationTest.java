package com.backend.presentation.controller;

import com.backend.infrastructure.adapter.dto.UpdatePasswordRequestDto;
import com.backend.presentation.dto.RegisterUserRequest;
import com.backend.presentation.dto.UpdateUserRequest;
import com.backend.support.PostgresContainerTestSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers(disabledWithoutDocker = true)
class UserControllerIntegrationTest extends PostgresContainerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldRequireAuthenticationToAccessUsers() throws Exception {
        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void shouldListUsersWhenAuthenticated() throws Exception {
        AuthSession session = registerUser("member@example.com", "Password123");

        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + session.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("member@example.com"));
    }

    @Test
    void shouldUpdateUserAndPasswordWhenAuthenticated() throws Exception {
        AuthSession session = registerUser("update@example.com", "Password123");

        mockMvc.perform(put("/api/v1/users/{id}", session.userId())
                        .header("Authorization", "Bearer " + session.token())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateUserRequest(
                                "updated@example.com",
                                "Juan",
                                "Perez",
                                null,
                                "30123456",
                                "+5491112345678",
                                null
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("updated@example.com"))
                .andExpect(jsonPath("$.name").value("Juan"))
                .andExpect(jsonPath("$.lastName").value("Perez"));

        MvcResult refreshedSessionResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"updated@example.com","password":"Password123"}
                                """))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode refreshedPayload = objectMapper.readTree(refreshedSessionResult.getResponse().getContentAsString());
        String refreshedToken = refreshedPayload.get("token").asText();

        mockMvc.perform(put("/api/v1/users/{id}/password", session.userId())
                        .header("Authorization", "Bearer " + refreshedToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdatePasswordRequestDto(
                                "Password123",
                                "NewPassword123",
                                "NewPassword123"
                        ))))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"updated@example.com","password":"NewPassword123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("updated@example.com"));
    }

    private AuthSession registerUser(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterUserRequest(email, password))))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode payload = objectMapper.readTree(result.getResponse().getContentAsString());
        return new AuthSession(
                payload.get("id").asText(),
                payload.get("token").asText()
        );
    }

    private record AuthSession(String userId, String token) {
    }
}
