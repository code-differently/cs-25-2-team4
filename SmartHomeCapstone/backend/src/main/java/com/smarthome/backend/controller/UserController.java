package com.smarthome.backend.controller;

import com.smarthome.backend.entity.User;
import com.smarthome.backend.repository.UserRepository;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserRepository userRepository;

        @Autowired
        public UserController(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        // Get all users
        @GetMapping
        public ResponseEntity<List<User>> getAllUsers() {
                List<User> users = userRepository.findAll();
                return ResponseEntity.ok(users);
        }

        // Get user by clerkId
        @GetMapping("/{clerkId}")
        public ResponseEntity<User> getUserByClerkId(@PathVariable String clerkId) {
                Optional<User> user = userRepository.findByClerkId(clerkId);
                return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }

        // Create or update user (for Clerk webhook)
        @PostMapping
        public ResponseEntity<User> createOrUpdateUser(@Valid @RequestBody User user) {
                try {
                        User savedUser = userRepository.save(user);
                        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
                } catch (Exception e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        // Update user
        @PutMapping("/{clerkId}")
        public ResponseEntity<User> updateUser(
                        @PathVariable String clerkId, @Valid @RequestBody User userDetails) {
                Optional<User> existingUser = userRepository.findByClerkId(clerkId);

                if (existingUser.isPresent()) {
                        User user = existingUser.get();
                        user.setUsername(userDetails.getUsername());
                        user.setFirstName(userDetails.getFirstName());
                        user.setLastName(userDetails.getLastName());
                        user.setEmail(userDetails.getEmail());

                        User updatedUser = userRepository.save(user);
                        return ResponseEntity.ok(updatedUser);
                } else {
                        return ResponseEntity.notFound().build();
                }
        }

        // Delete user
        @DeleteMapping("/{clerkId}")
        public ResponseEntity<Void> deleteUser(@PathVariable String clerkId) {
                if (userRepository.existsByClerkId(clerkId)) {
                        userRepository.deleteById(clerkId);
                        return ResponseEntity.noContent().build();
                } else {
                        return ResponseEntity.notFound().build();
                }
        }
}
