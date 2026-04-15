package com.chat.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.chat.dto.group.*;

import com.chat.service.GroupService;

import lombok.RequiredArgsConstructor;

@RestController

@RequestMapping("/api/group")

@RequiredArgsConstructor

public class GroupController {

    private final GroupService groupService;

    @PostMapping

    public ResponseEntity<GroupResponseDTO>

    createGroup(

            @RequestBody GroupRequestDTO dto

    ) {

        return ResponseEntity.ok(

                groupService.createGroup(dto)

        );
    }

    @GetMapping("/{groupId}")

    public ResponseEntity<GroupResponseDTO>

    getGroup(

            @PathVariable Long groupId

    ) {

        return ResponseEntity.ok(

                groupService.getGroup(groupId)

        );
    }

    @PostMapping("/add")

    public ResponseEntity<String>

    addMember(

            @RequestBody AddMemberDTO dto

    ) {

        groupService.addMember(dto);

        return ResponseEntity.ok("member added");

    }

    @PostMapping("/remove")

    public ResponseEntity<String>

    removeMember(

            @RequestBody AddMemberDTO dto

    ) {

        groupService.removeMember(dto);

        return ResponseEntity.ok("member removed");

    }
}