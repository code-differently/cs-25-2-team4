package com.smarthome.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

        @Value("${cors.allowed.origins:http://localhost:3000,http://127.0.0.1:3000}")
        private String allowedOrigins;

        public static void main(String[] args) {
                SpringApplication.run(BackendApplication.class, args);
        }

        @Bean
        public WebMvcConfigurer corsConfigurer() {
                return new WebMvcConfigurer() {
                        @Override
                        public void addCorsMappings(CorsRegistry registry) {
                                List<String> origins = Arrays.asList(allowedOrigins.split(","));
                                registry.addMapping("/api/**")
                                                .allowedOrigins(origins.toArray(new String[0]))
                                                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                                                .allowedHeaders("*")
                                                .allowCredentials(true);
                        }
                };
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                List<String> origins = Arrays.asList(allowedOrigins.split(","));
                origins.forEach(configuration::addAllowedOrigin);
                configuration.addAllowedMethod("*");
                configuration.addAllowedHeader("*");
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/api/**", configuration);
                return source;
        }
}