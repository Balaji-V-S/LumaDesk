package com.lumadesk.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

 @Override
 public void handle(HttpServletRequest request,
                    HttpServletResponse response,
                    AccessDeniedException accessDeniedException) throws IOException, ServletException {

     response.setStatus(HttpServletResponse.SC_FORBIDDEN);
     response.setContentType("application/json");

     Map<String, Object> body = new HashMap<>();
     body.put("timestamp", LocalDateTime.now().toString());
     body.put("status", 403);
     body.put("error", "Forbidden");
     body.put("message", "Access Denied: You do not have permission to access this resource.");
     body.put("path", request.getRequestURI());

     new ObjectMapper().writeValue(response.getOutputStream(), body);
 }
}