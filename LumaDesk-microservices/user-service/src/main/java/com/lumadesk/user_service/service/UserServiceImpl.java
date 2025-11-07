package com.lumadesk.user_service.service;

import com.lumadesk.user_service.dto.UpdateAddressRequest;
import com.lumadesk.user_service.dto.UpdateEmployeeDetailsRequest;
import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.exception.UserProfileNotFoundException;
import com.lumadesk.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;

    @Override
    @Transactional
    public UserProfile createUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Override
    @Transactional
    public UserProfile updateAddress(UpdateAddressRequest request) {
        UserProfile userProfile = userProfileRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserProfileNotFoundException("User not found with ID: " + request.getUserId()));

        userProfile.setAddress(request.getAddress());
        userProfile.setPinCode(request.getPinCode());

        return userProfileRepository.save(userProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfile getUserProfileById(Long userId) {
        return userProfileRepository.findById(userId)
                .orElseThrow(() -> new UserProfileNotFoundException("User not found with ID: " + userId));
    }

    @Override
    @Transactional
    public UserProfile updateEmployeeDetails(UpdateEmployeeDetailsRequest request) {
        UserProfile userProfile = userProfileRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserProfileNotFoundException("User not found with ID: " + request.getUserId()));

        userProfile.setEmployeeId(request.getEmployeeId());
        userProfile.setTeamId(request.getTeamId());

        return userProfileRepository.save(userProfile);
    }
}
