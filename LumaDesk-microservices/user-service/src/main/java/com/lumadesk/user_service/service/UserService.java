package com.lumadesk.user_service.service;

import com.lumadesk.user_service.entities.UserProfile;
import com.lumadesk.user_service.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfile createUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }
}
