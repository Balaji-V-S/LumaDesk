package com.lumadesk.ai_agent_service.controller;

import com.lumadesk.ai_agent_service.dto.TriageRequest;
import com.lumadesk.ai_agent_service.dto.TriageResponse;
import com.lumadesk.ai_agent_service.service.AiTriageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-agent/triage")
@RequiredArgsConstructor
public class AiTriageController {

    private final AiTriageService aiTriageService;

    @PostMapping("/suggest")
    public ResponseEntity<TriageResponse> suggestTriage(@Valid @RequestBody TriageRequest request) {
        TriageResponse response = aiTriageService.suggestTriage(request);
        return ResponseEntity.ok(response);
    }
}
