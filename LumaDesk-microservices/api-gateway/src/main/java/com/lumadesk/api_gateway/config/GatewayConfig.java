package com.lumadesk.api_gateway.config;

import com.lumadesk.api_gateway.security.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("lb://auth-service"))

                .route("user-service", r -> r.path("/api/users/**") //didn't add /internal/api/users/** coz don't want to expose feign endpoint to client
                        .filters(f -> f.filter(filter))
                        .uri("lb://user-service"))


                .route("ai-agent-service", r -> r.path("/api/ai-agent/**")
                        .filters(f -> f.filter(filter))
                        .uri("lb://ai-agent-service"))
                .build();
    }
}
