package com.lumadesk.auth_service.service;

import com.lumadesk.auth_service.dto.ChangePasswordRequest;
import com.lumadesk.auth_service.dto.SignInRequest;
import com.lumadesk.auth_service.dto.SignInResponse;
import com.lumadesk.auth_service.dto.SignUpRequest;
import com.lumadesk.auth_service.dto.UpdateRoleRequest;
import com.lumadesk.auth_service.entities.URoles;
import com.lumadesk.auth_service.entities.Users;
import com.lumadesk.auth_service.repository.UserRepository;
import com.lumadesk.auth_service.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public Users registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Registration failed: Email already in use: {}", signUpRequest.getEmail());
            throw new RuntimeException("Error: Email is already in use!");
        }
        Users user = new Users();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(URoles.ROLE_CUSTOMER); // Always assign ROLE_CUSTOMER by default
        Users savedUser = userRepository.save(user);
        log.info("New user registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }

    @Transactional
    public SignInResponse loginUser(SignInRequest loginRequest) {
        log.debug("Authenticating user: {}", loginRequest.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        log.debug("Authentication successful for user: {}", loginRequest.getEmail());
        Users user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found after successful authentication"));

        String jwt = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId().intValue()
        );
        log.debug("JWT generated for user: {}", user.getEmail());
        return new SignInResponse(jwt,user.getId(), user.getRole().name(),user.getFullName());
    }

    @Transactional
    public void changePassword(ChangePasswordRequest changePasswordRequest) {
        Users user = userRepository.findByEmail(changePasswordRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", changePasswordRequest.getEmail());
    }

    @Transactional
    public void updateUserRole(UpdateRoleRequest updateRoleRequest) {
        Users user = userRepository.findById(updateRoleRequest.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        try {
            URoles oldRole = user.getRole();
            URoles newRole = URoles.valueOf(updateRoleRequest.getRole());
            user.setRole(newRole);
            userRepository.save(user);
            log.info("Role updated successfully for user ID: {} to role: {}", oldRole,newRole);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified: " + updateRoleRequest.getRole());
        }
    }
}
