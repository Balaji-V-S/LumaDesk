package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.SLACreationRequest;
import com.lumadesk.ticket_service.dto.SLAUpdationRequest;
import com.lumadesk.ticket_service.entities.SLA;
import com.lumadesk.ticket_service.repository.SLARepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SLAServiceImpl implements SLAService {

    @Autowired
    private SLARepository slaRepository;

    @Override
    @Transactional
    public SLA createSLA(SLACreationRequest request) {
        SLA sla = new SLA();
        sla.setSeverity(request.getSeverity());
        sla.setPriority(request.getPriority());
        sla.setTimeLimitHour(request.getTimeLimitHour());
        return slaRepository.save(sla);
    }

    @Override
    @Transactional
    public SLA updateSLA(SLAUpdationRequest request) {
        SLA existingSLA = slaRepository.findById(request.getSlaId())
                .orElseThrow(() -> new RuntimeException("SLA not found"));

        existingSLA.setSeverity(request.getSeverity());
        existingSLA.setPriority(request.getPriority());
        existingSLA.setTimeLimitHour(request.getTimeLimitHour());

        return slaRepository.save(existingSLA);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SLA> getAllSLAs() {
        return slaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public SLA getSLAById(Long slaId) {
        return slaRepository.findById(slaId)
                .orElseThrow(() -> new RuntimeException("SLA not found"));
    }

    @Override
    @Transactional
    public void deleteSLA(Long slaId) {
        if (!slaRepository.existsById(slaId)) {
            throw new RuntimeException("SLA not found");
        }
        slaRepository.deleteById(slaId);
    }
}
