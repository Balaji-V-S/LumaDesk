package com.lumadesk.ai_agent_service.service;

import com.lumadesk.ai_agent_service.dto.TriageRequest;
import com.lumadesk.ai_agent_service.dto.TriageResponse;

public interface AiTriageService {

    TriageResponse suggestTriage(TriageRequest request);
}
