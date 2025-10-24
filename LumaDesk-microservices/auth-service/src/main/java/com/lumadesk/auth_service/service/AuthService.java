package com.lumadesk.auth_service.service;


import com.lumadesk.auth_service.dto.SignInRequest;
import com.lumadesk.auth_service.security.JwtUtil;
import com.lumadesk.auth_service.dto.SignInResponse;
import com.lumadesk.auth_service.dto.SignUpRequest;
import com.lumadesk.auth_service.entities.URoles;
import com.lumadesk.auth_service.entities.Users;
import com.lumadesk.auth_service.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

        // 2. Create a new User object
        Users user = new Users();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(URoles.valueOf(signUpRequest.getRole()));
        Users savedUser = userRepository.save(user);
        log.info("New user registered successfully: {}", savedUser.getEmail());
        return savedUser;
    }
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

        return new SignInResponse(
                jwt,
                "Bearer",
                user.getRole().name()
        );
    }
}
