package com.lumadesk.ticket_service.dto;

import com.lumadesk.ticket_service.entities.IssueCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AgentTicketCreationRequest {

    @NotNull(message = "Agent user ID cannot be null")
    private Long agentUserId;

    @NotNull(message = "Customer user ID cannot be null")
    private Long customerUserId;

    @NotNull(message = "Issue category ID cannot be null")
    private IssueCategory issueCategory;

    @NotBlank(message = "Issue description cannot be blank")
    private String issueDescription;
}
