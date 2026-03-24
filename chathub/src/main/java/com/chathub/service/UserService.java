package com.chathub.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chathub.entity.User;
import com.chathub.repository.UserRepo;


@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;


    // get all users
    public List<User> getAllUsers(){

        return userRepo.findAll();

    }

    public User createUser(User user){
        user.setCreatedAt(LocalDateTime.now());
        return userRepo.save(user);
    }

    public User getUserById(Long id){
        return userRepo.findById(id).orElse(null);
    }

    // public boolean updateUser(Long id){

    // }
}