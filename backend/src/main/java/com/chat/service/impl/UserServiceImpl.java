package com.chat.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.user.*;
import com.chat.entity.User;
import com.chat.enums.UserStatus;
import com.chat.repository.UserRepository;
import com.chat.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDTO getCurrentUser(String phone) {

        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return map(user);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());

        user.setProfilePic(dto.getProfilePic());

        user.setAbout(dto.getAbout());

        if(dto.getStatus() != null){

            user.setStatus(dto.getStatus());
        }

        return map(userRepository.save(user));
    }

    @Override
    public List<UserResponseDTO> searchUser(String keyword) {

        return userRepository
                .findByNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public void updateOnlineStatus(Long userId, boolean online) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(

                online

                        ? UserStatus.ONLINE

                        : UserStatus.OFFLINE
        );

        userRepository.save(user);
    }

    private UserResponseDTO map(User u) {

        return UserResponseDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .profilePic(u.getProfilePic())
                .about(u.getAbout())
                .status(u.getStatus())
                .build();
    }
}