package com.archipellibre.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.media.Schema;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI (Swagger) Configuration for L'Archipel Libre API
 * 
 * Configures Springdoc to generate OpenAPI documentation
 * accessible at:
 * - Swagger UI: http://localhost:8080/swagger-ui.html
 * - API Docs (JSON): http://localhost:8080/v3/api-docs
 * - API Docs (YAML): http://localhost:8080/v3/api-docs.yaml
 */
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("L'Archipel Libre API")
                        .description("Community platform API for L'Archipel Libre - Des îlots de technologie au service du lien social")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("L'Archipel Libre Team")
                                .url("https://archipellibre.fr")
                                .email("contact@archipellibre.fr")
                        )
                        .license(new License()
                                .name("GNU Affero General Public License v3.0")
                                .url("https://www.gnu.org/licenses/agpl-3.0.en.html")
                        )
                )
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token (without 'Bearer ' prefix)")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"));
    }
}
