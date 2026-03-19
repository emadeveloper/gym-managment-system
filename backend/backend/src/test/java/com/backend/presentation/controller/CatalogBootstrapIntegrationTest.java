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
class CatalogBootstrapIntegrationTest extends PostgresContainerTestSupport {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldExposeSeededRoutineAndNutritionTemplateCatalogsAndAllowNutritionAssignment() throws Exception {
        String token = registerUserAndGetToken("catalog-check@example.com", "Password123");

        MvcResult nutritionTemplatesResult = mockMvc.perform(get("/api/v1/nutrition-templates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$[0].name").isNotEmpty())
                .andReturn();

        mockMvc.perform(get("/api/v1/routine-templates")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$[0].days.length()", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$[0].days[0].exercises.length()", greaterThanOrEqualTo(1)));

        JsonNode templatesPayload = objectMapper.readTree(nutritionTemplatesResult.getResponse().getContentAsString());
        String templateId = templatesPayload.get(0).get("id").asText();

        mockMvc.perform(post("/api/v1/nutrition-templates/{id}/assign", templateId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "assignedMemberEmail": "catalog-check@example.com",
                                  "status": "Activo",
                                  "reviewDate": "2026-07-15"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.assignedMemberEmail").value("catalog-check@example.com"))
                .andExpect(jsonPath("$.sourceTemplateId").value(templateId));
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
