package com.lumadesk.ticket_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTicketRequest {

    @NotBlank(message = "Issue description cannot be blank")
    private String issueDescription;

    /**
     * The ID of the user for whom the ticket is being created.
     * If null, the ticket is created for the person making the request (the customer).
     * If provided, the person making the request is a support agent creating a ticket on behalf of a customer.
     */
    private Long createdForId;
}
