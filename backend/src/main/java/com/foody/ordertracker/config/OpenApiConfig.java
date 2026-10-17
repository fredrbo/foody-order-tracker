package com.foody.ordertracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI orderTrackerOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Foody Order Tracker API")
                        .description("API REST para cadastro e rastreamento de pedidos de delivery.")
                        .version("v1")
                        .contact(new Contact().name("Frederico Rabelo")));
    }
}
