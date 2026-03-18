package com.backend.presentation.controller;

import com.backend.presentation.dto.RegisterUserRequest;
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

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Testcontainers(disabledWithoutDocker = true)
class ExerciseLibraryBootstrapIntegrationTest extends PostgresContainerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldExposeSeededExerciseLibraryWithPaginationAndThumbnail() throws Exception {
        String token = registerUserAndGetToken("library-check@example.com", "Password123");

        mockMvc.perform(get("/api/v1/exercises/paged")
                        .param("page", "0")
                        .param("size", "6")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(6))
                .andExpect(jsonPath("$.totalElements", greaterThanOrEqualTo(30)));

        mockMvc.perform(get("/api/v1/exercises")
                        .param("search", "press inclinado con mancuernas")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Press inclinado con mancuernas"))
                .andExpect(jsonPath("$[0].thumbnailPath").value("/exercises/press-inclinado-mancuernas.webp"));
    }

    private String registerUserAndGetToken(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new RegisterUserRequest(email, password))))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode payload = objectMapper.readTree(result.getResponse().getContentAsString());
        return payload.get("token").asText();
    }
}
