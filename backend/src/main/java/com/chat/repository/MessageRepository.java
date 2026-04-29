package com.chat.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.chat.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;




public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatIdOrderByTimestampAsc(String chatId);
    List<Message> findByChatIdAndReceiver_Id(String chatId,Long receiverId);
    List<Message> findByChatId(String chatId);
    List<Message> findByScheduledTrueAndScheduledTimeBefore(LocalDateTime time);
}