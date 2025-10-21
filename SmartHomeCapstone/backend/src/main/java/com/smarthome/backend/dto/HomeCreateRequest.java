package com.smarthome.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class HomeCreateRequest {

        @NotBlank(message = "Home name is required")
        @Size(min = 1, max = 100, message = "Home name must be between 1 and 100 characters")
        private String name;

        @Size(max = 255, message = "Address cannot exceed 255 characters")
        private String address;

        // Constructors
        public HomeCreateRequest() {}

        public HomeCreateRequest(String name, String address) {
                this.name = name;
                this.address = address;
        }

        // Getters and setters
        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }

        public String getAddress() {
                return address;
        }

        public void setAddress(String address) {
                this.address = address;
        }
}
