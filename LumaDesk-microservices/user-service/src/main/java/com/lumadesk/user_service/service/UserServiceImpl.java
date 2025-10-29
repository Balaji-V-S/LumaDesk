package com.lumadesk.user_service.service;

import com.lumadesk.user_service.dto.UpdateAddressRequest;
import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.exception.UserProfileNotFoundException;
import com.lumadesk.user_service.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfile createUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Transactional
    public UserProfile updateAddress(UpdateAddressRequest request) {
        UserProfile userProfile = userProfileRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserProfileNotFoundException("User profile not found"));
        userProfile.setAddress(request.getAddress());
        userProfile.setPinCode(request.getPinCode());
        return userProfileRepository.save(userProfile);
    }
}
