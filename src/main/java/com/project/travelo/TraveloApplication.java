package com.project.travelo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class TraveloApplication {

	public static void main(String[] args) {
		SpringApplication.run(TraveloApplication.class, args);

		// Startup message
		System.out.println("\n========================================");
		System.out.println("🚀 TravelO Backend is running!");
		System.out.println("📍 API Base URL: http://localhost:5000/api");
		System.out.println("✅ Connected to MS SQL Server");
		System.out.println("========================================\n");
	}

	// CORS Configuration - Allows React frontend to connect
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins("http://localhost:3000")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}
}