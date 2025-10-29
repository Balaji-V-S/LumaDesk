package com.lumadesk.user_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    private Long userId;
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    private String phoneNumber;
    private String address;
    private String pinCode;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // employee specific fields
    @Column(nullable = true)
    private String employeeId;
    @Column(nullable = true)
    private String teamId;
}
