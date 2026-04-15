package com.chat.dto.user;

import com.chat.enums.UserStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private Long id;

    private String name;

    private String email;

    private String phoneNumber;

    private String profilePic;

    private String about;

    private UserStatus status;
}