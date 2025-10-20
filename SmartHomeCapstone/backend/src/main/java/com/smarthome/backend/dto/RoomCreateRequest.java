package com.smarthome.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RoomCreateRequest {

        @NotBlank(message = "Room name is required")
        @Size(min = 1, message = "Room name at least 1 character")
        private String name;

        @NotNull(message = "Home ID is required")
        private Long homeId;

        // Constructors
        public RoomCreateRequest() {}

        public RoomCreateRequest(String name, Long homeId) {
                this.name = name;
                this.homeId = homeId;
        }

        // Getters and setters
        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }

        public Long getHomeId() {
                return homeId;
        }

        public void setHomeId(Long homeId) {
                this.homeId = homeId;
        }
}
