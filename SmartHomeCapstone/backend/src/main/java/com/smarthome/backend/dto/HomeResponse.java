package com.smarthome.backend.dto;

import com.smarthome.backend.entity.Home;
import java.util.Set;
import java.util.stream.Collectors;

public class HomeResponse {

        private Long homeId;
        private String name;
        private String address;
        private int roomCount;
        private Set<Long> roomIds;

        // Constructors
        public HomeResponse() {}

        public HomeResponse(Home home) {
                this.homeId = home.getHomeId();
                this.name = home.getName();
                this.address = home.getAddress();

                if (home.getRooms() != null) {
                        this.roomCount = home.getRooms().size();
                        this.roomIds =
                                        home.getRooms().stream()
                                                        .map(room -> room.getRoomId())
                                                        .collect(Collectors.toSet());
                } else {
                        this.roomCount = 0;
                        this.roomIds = Set.of();
                }
        }

        // Getters and setters
        public Long getHomeId() {
                return homeId;
        }

        public void setHomeId(Long homeId) {
                this.homeId = homeId;
        }

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

        public int getRoomCount() {
                return roomCount;
        }

        public void setRoomCount(int roomCount) {
                this.roomCount = roomCount;
        }

        public Set<Long> getRoomIds() {
                return roomIds;
        }

        public void setRoomIds(Set<Long> roomIds) {
                this.roomIds = roomIds;
        }
}
