package com.lumadesk.ai_agent_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableDiscoveryClient
@CrossOrigin(origins="*")
public class AiAgentServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AiAgentServiceApplication.class, args);
	}
}
