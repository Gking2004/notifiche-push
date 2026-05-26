package com.r2u.notification.dto.mapper.Impl;

import org.springframework.stereotype.Component;

import com.r2u.notification.dto.mapper.UserMapper;
import com.r2u.notification.dto.request.UserRequest;
import com.r2u.notification.dto.response.UserResponse;
import com.r2u.notification.entity.UserEntity;

@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserEntity toEntity(UserRequest userRequest) {
        if (userRequest == null) {
            return null;
        }
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(userRequest.getUsername());
        userEntity.setEmail(userRequest.getEmail());
        return userEntity;
    }

    @Override
    public UserResponse toResponse(UserEntity userEntity) {
        if (userEntity == null) {
            return null;
        }
        UserResponse userResponse = new UserResponse();
        userResponse.setId(userEntity.getId());
        userResponse.setUsername(userEntity.getUsername());
        userResponse.setEmail(userEntity.getEmail());
        return userResponse;
    }
}
