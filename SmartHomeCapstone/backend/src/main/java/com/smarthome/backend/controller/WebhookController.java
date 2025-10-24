package com.smarthome.backend.controller;

import com.smarthome.backend.entity.User;
import com.smarthome.backend.repository.UserRepository;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

        private final UserRepository userRepository;

        @Autowired
        public WebhookController(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        // Clerk webhook endpoint for user events
        @PostMapping("/clerk")
        public ResponseEntity<String> handleClerkWebhook(@RequestBody Map<String, Object> payload) {
                try {
                        String type = (String) payload.get("type");
                        @SuppressWarnings("unchecked")
                        Map<String, Object> data = (Map<String, Object>) payload.get("data");

                        if (data == null) {
                                return ResponseEntity.badRequest().body("Invalid payload");
                        }

                        String clerkId = (String) data.get("id");
                        String email = getEmailFromData(data);
                        String firstName = (String) data.get("first_name");
                        String lastName = (String) data.get("last_name");
                        String username = (String) data.get("username");

                        // Generate username if not provided
                        if (username == null || username.isEmpty()) {
                                username = email != null ? email.split("@")[0] : "user_" + clerkId.substring(0, 8);
                        }

                        switch (type) {
                                case "user.created":
                                        createUser(clerkId, username, firstName, lastName, email);
                                        break;
                                case "user.updated":
                                        updateUser(clerkId, username, firstName, lastName, email);
                                        break;
                                case "user.deleted":
                                        deleteUser(clerkId);
                                        break;
                                default:
                                        // Ignore other event types
                                        break;
                        }

                        return ResponseEntity.ok("Webhook processed successfully");
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.internalServerError().body("Error processing webhook");
                }
        }

        @SuppressWarnings("unchecked")
        private String getEmailFromData(Map<String, Object> data) {
                // Clerk stores emails in an array of email objects
                Object emailAddressesObj = data.get("email_addresses");
                if (emailAddressesObj instanceof java.util.List) {
                        java.util.List<Map<String, Object>> emailAddresses =
                                        (java.util.List<Map<String, Object>>) emailAddressesObj;
                        if (!emailAddresses.isEmpty()) {
                                return (String) emailAddresses.get(0).get("email_address");
                        }
                }
                return null;
        }

        private void createUser(
                        String clerkId, String username, String firstName, String lastName, String email) {
                if (!userRepository.existsByClerkId(clerkId)) {
                        String fullName = (firstName + " " + lastName).trim();
                        if (fullName.isEmpty()) {
                                fullName = username != null ? username : "User";
                        }
                        User user = new User(clerkId, username, fullName, email);
                        userRepository.save(user);
                }
        }

        private void updateUser(
                        String clerkId, String username, String firstName, String lastName, String email) {
                userRepository
                                .findByClerkId(clerkId)
                                .ifPresent(
                                                user -> {
                                                        user.setUsername(username);
                                                        String fullName = (firstName + " " + lastName).trim();
                                                        if (fullName.isEmpty()) {
                                                                fullName = username != null ? username : "User";
                                                        }
                                                        user.setFullName(fullName);
                                                        user.setEmail(email);
                                                        userRepository.save(user);
                                                });
        }

        private void deleteUser(String clerkId) {
                if (userRepository.existsByClerkId(clerkId)) {
                        userRepository.deleteById(clerkId);
                }
        }
}
