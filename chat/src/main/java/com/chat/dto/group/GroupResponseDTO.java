package com.chat.dto.group;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupResponseDTO {

    private Long groupId;

    private String name;

    private String description;

    private String groupImage;

    private Long createdBy;

    private List<Long> members;
}