package com.chat.dto.auth;

import com.chat.enums.UserStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private Long userId;
    private String name;
    private String phoneNumber;
    private UserStatus status;
    private String token;

}