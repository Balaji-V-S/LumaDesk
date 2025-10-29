package com.lumadesk.auth_service.service;

import com.lumadesk.auth_service.dto.*;
import com.lumadesk.auth_service.entities.Users;

public interface AuthService {
    public Users registerUser(SignUpRequest signUpRequest);
    public SignInResponse loginUser(SignInRequest loginRequest);
    public void updateUserRole(UpdateRoleRequest updateRoleRequest);
    public void changePassword(ChangePasswordRequest changePasswordRequest);

}
