package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.SLACreationRequest;
import com.lumadesk.ticket_service.dto.SLAUpdationRequest;
import com.lumadesk.ticket_service.entities.SLA;

import java.util.List;

public interface SLAService {
    SLA createSLA(SLACreationRequest request);
    SLA updateSLA(SLAUpdationRequest request);
    List<SLA> getAllSLAs();
    SLA getSLAById(Long slaId);
    void deleteSLA(Long slaId);
}
