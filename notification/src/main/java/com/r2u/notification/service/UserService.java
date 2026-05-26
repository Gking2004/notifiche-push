package com.r2u.notification.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.r2u.notification.dto.mapper.UserMapper;
import com.r2u.notification.dto.request.UserRequest;
import com.r2u.notification.dto.response.UserResponse;
import com.r2u.notification.entity.UserEntity;
import com.r2u.notification.exception.UserNotFoundException;
import com.r2u.notification.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public List<UserResponse> findAllUsers() {
        log.info("Finding all users");
        return userRepository.findAll().stream()
            .map(userMapper::toResponse)
            .collect(Collectors.toList());
    }

    public UserResponse findById(Long id) {
        log.info("Finding user with id: {}", id);
        return userMapper.toResponse(
            userRepository.findById(id)
                .orElseThrow(() -> UserNotFoundException.create(id))
        );
    }

    public UserResponse findByUsername(String username) {
        log.info("Finding user with username: {}", username);
        return userMapper.toResponse(
            userRepository.findByUsername(username)
                .orElseThrow(() -> UserNotFoundException.createByUsername(username))
        );
    }

    @Transactional
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        log.info("Updating user with id: {}", id);
        UserEntity userEntity = userRepository.findById(id)
            .orElseThrow(() -> UserNotFoundException.create(id));
            
        userEntity.setUsername(userRequest.getUsername());
        userEntity.setEmail(userRequest.getEmail());
        
        return userMapper.toResponse(userRepository.save(userEntity));
    }

    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        if (!userRepository.existsById(id)) {
            throw UserNotFoundException.create(id);
        }
        userRepository.deleteById(id);
    }
}
