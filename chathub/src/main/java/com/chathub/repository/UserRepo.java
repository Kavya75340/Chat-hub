package com.chathub.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chathub.entity.User;

@Repository
public interface  UserRepo extends JpaRepository<User, Long>{
    Optional<User> findByEmail(String email);

    List<User> findByNameContainingIgnoreCase(String name);

}
