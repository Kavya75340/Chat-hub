package com.chat.service;

import java.util.List;

import com.chat.dto.user.UserRequestDTO;
import com.chat.dto.user.UserResponseDTO;

public interface UserService {

    UserResponseDTO getCurrentUser(String phone);

    UserResponseDTO updateUser(Long id, UserRequestDTO dto);

    List<UserResponseDTO> searchUser(String keyword);

    void updateOnlineStatus(Long userId, boolean online);

}