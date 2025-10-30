package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Issue description cannot be blank")
    private String issueDescription;
    private Long createdForId;
}
