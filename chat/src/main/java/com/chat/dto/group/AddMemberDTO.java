package com.chat.dto.group;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMemberDTO {

    private Long groupId;

    private Long userId;
}