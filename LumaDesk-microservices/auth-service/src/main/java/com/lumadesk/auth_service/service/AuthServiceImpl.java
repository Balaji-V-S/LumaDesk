package com.lumadesk.auth_service.service;

import com.lumadesk.auth_service.client.UserClient;
import com.lumadesk.auth_service.dto.*;
import com.lumadesk.auth_service.entities.URoles;
import com.lumadesk.auth_service.entities.Users;
import com.lumadesk.auth_service.repository.UserRepository;
import com.lumadesk.auth_service.security.JwtUtil;
import com.lumadesk.auth_service.exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService{

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserClient userClient;

    @Transactional
    public Users registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            log.warn("Registration failed: Email already in use: {}", signUpRequest.getEmail());
            throw new EmailAlreadyInUseException("Error: Email is already in use!");
        }
        //saving the user in auth db
        Users user = new Users();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(URoles.ROLE_CUSTOMER); // Default role
        user.setFullName(signUpRequest.getFullName());
        Users savedUser = userRepository.save(user);
        log.info("New auth user '{}' saved to database with ID: {}", savedUser.getEmail(), savedUser.getId());
        //make a synchronous call to user-service to create the user profile
        try {
            log.debug("Calling user-service to create profile for user ID: {}", savedUser.getId());
            UserCreationRequest userCreationRequest = new UserCreationRequest(
                    savedUser.getId(),
                    signUpRequest.getFullName(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPhoneNumber(),
                    signUpRequest.getAddress(),
                    signUpRequest.getPinCode()
            );
            userClient.createUserProfile(userCreationRequest);
            log.info("Successfully created profile in user-service for user ID: {}", savedUser.getId());
        } catch (Exception e) {
            log.error("Failed to create profile in user-service for user ID: {}. Rolling back transaction.", savedUser.getId(), e);
            throw new UserProfileCreationException("Failed to create user profile in user-service", e);
        }
        return savedUser;
    }

    @Transactional
    public SignInResponse loginUser(SignInRequest loginRequest) {
        log.debug("Authenticating user: {}", loginRequest.getEmail());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        log.debug("Authentication successful for user: {}", loginRequest.getEmail());
        Users user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found after successful authentication"));

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
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(changePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", changePasswordRequest.getEmail());
    }

    @Transactional
    public void updateUserRole(UpdateRoleRequest updateRoleRequest) {
        Users user = userRepository.findById(updateRoleRequest.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        try {
            URoles oldRole = user.getRole();
            URoles newRole = URoles.valueOf(updateRoleRequest.getRole());
            user.setRole(newRole);
            userRepository.save(user);
            log.info("Role updated successfully for user ID: {} from role: {} to role: {}", user.getId(), oldRole, newRole);
        } catch (IllegalArgumentException e) {
            throw new InvalidRoleException("Invalid role specified: " + updateRoleRequest.getRole());
        }
    }
}
