package com.chat.service;

import com.chat.dto.group.*;

public interface GroupService {

    GroupResponseDTO createGroup(GroupRequestDTO dto);

    GroupResponseDTO getGroup(Long groupId);

    void addMember(AddMemberDTO dto);

    void removeMember(AddMemberDTO dto);
}