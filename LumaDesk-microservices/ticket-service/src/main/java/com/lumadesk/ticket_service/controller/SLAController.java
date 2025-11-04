package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.dto.SLACreationRequest;
import com.lumadesk.ticket_service.dto.SLAUpdationRequest;
import com.lumadesk.ticket_service.entities.SLA;
import com.lumadesk.ticket_service.service.SLAService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@SecurityRequirement(name="Bearer Authentication")
@RequestMapping("/api/sla")
public class SLAController {

    private SLAService slaService;

    @PostMapping("/create")
    public ResponseEntity<SLA> createSLA(@Valid @RequestBody SLACreationRequest request) {
        SLA createdSLA = slaService.createSLA(request);
        return ResponseEntity.ok(createdSLA);
    }

    @PutMapping("/update")
    public ResponseEntity<SLA> updateSLA(@Valid @RequestBody SLAUpdationRequest request) {
        SLA updatedSLA = slaService.updateSLA(request);
        return ResponseEntity.ok(updatedSLA);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SLA>> getAllSLAs() {
        List<SLA> slas = slaService.getAllSLAs();
        return ResponseEntity.ok(slas);
    }

    @GetMapping("/get/{slaId}")
    public ResponseEntity<SLA> getSLAById(@PathVariable Long slaId) {
        SLA sla = slaService.getSLAById(slaId);
        return ResponseEntity.ok(sla);
    }

    @DeleteMapping("/delete/{slaId}")
    public ResponseEntity<String> deleteSLA(@PathVariable Long slaId) {
        slaService.deleteSLA(slaId);
        return ResponseEntity.ok("SLA deleted successfully");
    }
}
