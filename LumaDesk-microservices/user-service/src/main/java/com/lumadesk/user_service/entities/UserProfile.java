package com.lumadesk.user_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String pinCode;
    private LocalDateTime createdAt;
    // employee specific fields
    @Column(nullable = true)
    private String employeeId;
    @Column(nullable = true)
    private String teamId;
}
