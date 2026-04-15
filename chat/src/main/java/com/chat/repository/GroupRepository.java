package com.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.chat.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
}