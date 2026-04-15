package com.chat.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.chat.dto.group.*;
import com.chat.entity.Group;
import com.chat.entity.GroupMember;
import com.chat.repository.GroupMemberRepository;
import com.chat.repository.GroupRepository;
import com.chat.service.GroupService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    @Override
    public GroupResponseDTO createGroup(GroupRequestDTO dto) {

        Group group = Group.builder()

                .name(dto.getName())

                .description(dto.getDescription())

                .groupImage(dto.getGroupImage())

                .createdBy(dto.getCreatedBy())

                .build();

        Group savedGroup = groupRepository.save(group);

        for(Long userId : dto.getMembers()) {

            GroupMember member = GroupMember.builder()

                    .groupId(savedGroup.getId())

                    .userId(userId)

                    .admin(userId.equals(dto.getCreatedBy()))

                    .build();

            groupMemberRepository.save(member);
        }

        return getGroup(savedGroup.getId());
    }

    @Override
    public GroupResponseDTO getGroup(Long groupId) {

        Group group = groupRepository.findById(groupId)

                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Long> members = groupMemberRepository

                .findByGroupId(groupId)

                .stream()

                .map(GroupMember::getUserId)

                .collect(Collectors.toList());

        return GroupResponseDTO.builder()

                .groupId(group.getId())

                .name(group.getName())

                .description(group.getDescription())

                .groupImage(group.getGroupImage())

                .createdBy(group.getCreatedBy())

                .members(members)

                .build();
    }

    @Override
    public void addMember(AddMemberDTO dto) {

        GroupMember member = GroupMember.builder()

                .groupId(dto.getGroupId())

                .userId(dto.getUserId())

                .admin(false)

                .build();

        groupMemberRepository.save(member);
    }

    @Override
    public void removeMember(AddMemberDTO dto) {

        groupMemberRepository

                .deleteByGroupIdAndUserId(

                        dto.getGroupId(),

                        dto.getUserId()
                );
    }
}