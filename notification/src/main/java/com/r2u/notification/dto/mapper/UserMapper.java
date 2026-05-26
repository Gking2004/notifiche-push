package com.r2u.notification.dto.mapper;

import org.mapstruct.Mapper;

import com.r2u.notification.dto.request.UserRequest;
import com.r2u.notification.dto.response.UserResponse;
import com.r2u.notification.entity.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserEntity toEntity(UserRequest userRequest);

    UserResponse toResponse(UserEntity userEntity);
}
