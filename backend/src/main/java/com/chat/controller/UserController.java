package com.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chat.dto.user.UserRequestDTO;
import com.chat.dto.user.UserResponseDTO;
import com.chat.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController

@RequestMapping("/api/users")

@RequiredArgsConstructor

public class UserController {

    private final UserService userService;

    @GetMapping("/me")

    public ResponseEntity<UserResponseDTO>

    getCurrentUser(

            Authentication auth

    ) {

        return ResponseEntity.ok(

                userService.getCurrentUser(

                        auth.getName()

                )
        );
    }

    @PutMapping("/{id}")

    public ResponseEntity<UserResponseDTO>

    updateUser(

            @PathVariable Long id,

            @RequestBody UserRequestDTO dto

    ) {

        return ResponseEntity.ok(

                userService.updateUser(id, dto)
        );
    }

    @GetMapping("/search")

    public ResponseEntity<List<UserResponseDTO>>

    searchUser(

            @RequestParam String keyword

    ) {

        return ResponseEntity.ok(

                userService.searchUser(keyword)
        );
    }

    @PutMapping("/{id}/online")

    public ResponseEntity<String>

    updateOnline(

            @PathVariable Long id,

            @RequestParam boolean online

    ) {

        userService.updateOnlineStatus(id, online);

        return ResponseEntity.ok("status updated");

    }
}