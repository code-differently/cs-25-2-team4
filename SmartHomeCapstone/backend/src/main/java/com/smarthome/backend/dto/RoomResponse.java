package com.smarthome.backend.dto;

import com.smarthome.backend.entity.Room;
import java.util.Set;
import java.util.stream.Collectors;

public class RoomResponse {

        private Long roomId;
        private String name;
        private Long homeId;
        private String homeName;
        private int deviceCount;
        private Set<Long> deviceIds;

        // Constructors
        public RoomResponse() {}

        public RoomResponse(Room room) {
                this.roomId = room.getRoomId();
                this.name = room.getName();
                this.homeId = room.getHome().getHomeId();
                this.homeName = room.getHome().getName();
                
                if (room.getDevices() != null) {
                        this.deviceCount = room.getDevices().size();
                        this.deviceIds = room.getDevices().stream()
                                        .map(device -> device.getDeviceId())
                                        .collect(Collectors.toSet());
                } else {
                        this.deviceCount = 0;
                        this.deviceIds = Set.of();
                }
        }

        // Getters and setters
        public Long getRoomId() {
                return roomId;
        }

        public void setRoomId(Long roomId) {
                this.roomId = roomId;
        }

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

        public String getHomeName() {
                return homeName;
        }

        public void setHomeName(String homeName) {
                this.homeName = homeName;
        }

        public int getDeviceCount() {
                return deviceCount;
        }

        public void setDeviceCount(int deviceCount) {
                this.deviceCount = deviceCount;
        }

        public Set<Long> getDeviceIds() {
                return deviceIds;
        }

        public void setDeviceIds(Set<Long> deviceIds) {
                this.deviceIds = deviceIds;
        }
}