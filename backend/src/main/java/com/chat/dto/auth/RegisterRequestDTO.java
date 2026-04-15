package com.chat.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequestDTO {

    private String name;
    private String phoneNumber;
    private String email;
    private String password;

}