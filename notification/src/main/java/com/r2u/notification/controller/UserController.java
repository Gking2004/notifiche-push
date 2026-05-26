package com.r2u.notification.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.r2u.notification.dto.request.UserRequest;
import com.r2u.notification.dto.response.UserResponse;
import com.r2u.notification.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
public class UserController {

    private final UserService userService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get all users", description = "Returns a list of all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<List<UserResponse>> findAllUsers() {
        log.info("GET /users");
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get a user by database ID", description = "Returns the user with the specified primary key ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<UserResponse> findById(@PathVariable Long id) {
        log.info("GET /users/{}", id);
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/username/{username}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Get a user by username", description = "Returns the user with the specified username")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User found", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<UserResponse> findByUsername(@PathVariable String username) {
        log.info("GET /users/username/{}", username);
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update a user by ID", description = "Updates the user with the specified ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest userRequest) {
        log.info("PUT /users/{} with body: {}", id, userRequest);
        return ResponseEntity.ok(userService.updateUser(id, userRequest));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete a user by ID", description = "Deletes the user with the specified ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("DELETE /users/{}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
