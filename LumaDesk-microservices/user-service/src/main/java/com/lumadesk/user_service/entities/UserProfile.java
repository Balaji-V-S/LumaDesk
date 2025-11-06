package com.lumadesk.user_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    @Id
    private Long userId;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true, nullable = false)
    private String email;

    @Pattern(
            regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10}$",
            message = "Invalid phone number format"
    )
    @Column(length = 15)
    private String phoneNumber;

    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @Size(max = 25, message = "Area must not exceed 25 characters")
    private String area;

    @Pattern(
            regexp = "^\\d{5,6}$",
            message = "Pin code must be 5 or 6 digits"
    )
    private String pinCode;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // employee specific fields
    @Size(max = 10, message = "Employee ID must not exceed 10 characters")
    @Column(nullable = true)
    private String employeeId;

    @Size(max = 10, message = "Team ID must not exceed 10 characters")
    @Column(nullable = true)
    private String teamId;
}
