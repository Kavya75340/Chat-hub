package com.chat.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.chat.dto.file.FileResponseDTO;
import com.chat.entity.Attachment;
import com.chat.enums.FileType;
import com.chat.repository.AttachmentRepository;
import com.chat.service.FileService;
import com.chat.utils.FileUtil;

import lombok.RequiredArgsConstructor;

@Service

@RequiredArgsConstructor

public class FileServiceImpl implements FileService {

    private final AttachmentRepository attachmentRepository;

    private final FileUtil fileUtil;

    @Override

    public FileResponseDTO uploadFile(

            MultipartFile file,

            String chatId,

            Long senderId

    ) throws IOException {

        // detect file type

        FileType fileType = detectType(

                file.getContentType()
        );

        // save physical file

        String fileName = fileUtil.saveFile(file);

        // create db entry

        Attachment attachment = Attachment.builder()

                .fileName(fileName)

                .fileType(fileType)

                .fileUrl("/uploads/" + fileName)

                .chatId(chatId)

                .senderId(senderId)

                .build();

        Attachment saved = attachmentRepository.save(attachment);

        return map(saved);
    }

    @Override

    public List<FileResponseDTO> getFiles(String chatId) {

        return attachmentRepository

                .findByChatId(chatId)

                .stream()

                .map(this::map)

                .collect(Collectors.toList());
    }

    private FileType detectType(String contentType){

        if(contentType == null)
            return FileType.DOCUMENT;
    
        contentType = contentType.toLowerCase();
    
        if(contentType.contains("image"))
            return FileType.IMAGE;
    
        if(contentType.contains("video"))
            return FileType.VIDEO;
    
        if(contentType.contains("audio"))
            return FileType.AUDIO;
    
        if(contentType.contains("pdf"))
            return FileType.DOCUMENT;
    
        if(contentType.contains("msword"))
            return FileType.DOCUMENT;
    
        if(contentType.contains("officedocument"))
            return FileType.DOCUMENT;
    
        return FileType.DOCUMENT;
    }

    private FileResponseDTO map(Attachment a){

        return FileResponseDTO.builder()

                .id(a.getId())

                .fileName(a.getFileName())

                .fileType(a.getFileType())

                .fileUrl(a.getFileUrl())

                .chatId(a.getChatId())

                .senderId(a.getSenderId())

                .build();
    }
}