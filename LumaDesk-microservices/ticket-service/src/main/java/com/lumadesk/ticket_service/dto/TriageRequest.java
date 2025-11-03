package com.lumadesk.ticket_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TriageRequest {
    private String issueCategory;
    private String issueDescription;
}
