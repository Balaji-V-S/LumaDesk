package com.lumadesk.user_service.service;

import com.lumadesk.user_service.dto.UpdateAddressRequest;
import com.lumadesk.user_service.entities.UserProfile;

public interface UserService {
    public UserProfile createUserProfile(UserProfile userProfile);
    public UserProfile updateAddress(UpdateAddressRequest request);
    public UserProfile getUserProfileById(Long userId);
}
