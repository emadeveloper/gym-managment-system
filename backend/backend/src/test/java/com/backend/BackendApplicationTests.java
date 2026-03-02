package com.backend;

import com.backend.support.PostgresContainerTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest
@ActiveProfiles("test")
@Testcontainers(disabledWithoutDocker = true)
class BackendApplicationTests extends PostgresContainerTestSupport {

	@Test
	void contextLoads() {
	}

}
