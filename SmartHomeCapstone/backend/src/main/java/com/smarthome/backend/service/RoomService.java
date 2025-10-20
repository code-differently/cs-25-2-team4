package com.smarthome.backend.service;

import com.smarthome.backend.dto.RoomCreateRequest;
import com.smarthome.backend.entity.Home;
import com.smarthome.backend.entity.Room;
import com.smarthome.backend.repository.HomeRepository;
import com.smarthome.backend.repository.RoomRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RoomService {

        private final RoomRepository roomRepository;
        private final HomeRepository homeRepository;

        @Autowired
        public RoomService(RoomRepository roomRepository, HomeRepository homeRepository) {
                this.roomRepository = roomRepository;
                this.homeRepository = homeRepository;
        }

        /** Create a new room */
        public Room createRoom(RoomCreateRequest request) {
                // Check if home exists
                Optional<Home> home = homeRepository.findById(request.getHomeId());
                if (home.isEmpty()) {
                        throw new RuntimeException("Home not found with ID: " + request.getHomeId());
                }

                // Check if room with same name already exists in this home
                if (roomRepository.existsByNameAndHome_HomeId(request.getName(), request.getHomeId())) {
                        throw new RuntimeException("Room with name '" + request.getName() + 
                                        "' already exists in this home");
                }

                Room room = new Room(home.get(), request.getName());
                return roomRepository.save(room);
        }

        /** Get room by ID */
        public Optional<Room> getRoomById(Long roomId) {
                return roomRepository.findById(roomId);
        }

        /** Get all rooms */
        public List<Room> getAllRooms() {
                return roomRepository.findAll();
        }

        /** Get rooms by home ID */
        public List<Room> getRoomsByHomeId(Long homeId) {
                return roomRepository.findByHome_HomeId(homeId);
        }

        /** Get rooms for a specific user */
        public List<Room> getRoomsByUserId(Long userId) {
                return roomRepository.findRoomsByUserId(userId);
        }

        /** Search rooms by name */
        public List<Room> searchRoomsByName(String name) {
                return roomRepository.findByNameContainingIgnoreCase(name);
        }

        /** Update room */
        public Room updateRoom(Long roomId, RoomCreateRequest request) {
                Optional<Room> existingRoom = roomRepository.findById(roomId);
                if (existingRoom.isEmpty()) {
                        throw new RuntimeException("Room not found with ID: " + roomId);
                }

                Room room = existingRoom.get();
                
                // Check if home exists if being changed
                if (!room.getHome().getHomeId().equals(request.getHomeId())) {
                        Optional<Home> newHome = homeRepository.findById(request.getHomeId());
                        if (newHome.isEmpty()) {
                                throw new RuntimeException("Home not found with ID: " + request.getHomeId());
                        }
                        room.setHome(newHome.get());
                }

                // Check if new name conflicts with existing room in the same home
                if (!room.getName().equals(request.getName()) 
                                && roomRepository.existsByNameAndHome_HomeId(request.getName(), request.getHomeId())) {
                        throw new RuntimeException("Room with name '" + request.getName() + 
                                        "' already exists in this home");
                }

                room.setName(request.getName());
                
                return roomRepository.save(room);
        }

        /** Delete room */
        public void deleteRoom(Long roomId) {
                if (!roomRepository.existsById(roomId)) {
                        throw new RuntimeException("Room not found with ID: " + roomId);
                }
                roomRepository.deleteById(roomId);
        }

        /** Get device count for a room */
        public long getDeviceCountByRoomId(Long roomId) {
                Optional<Room> room = roomRepository.findById(roomId);
                if (room.isPresent() && room.get().getDevices() != null) {
                        return room.get().getDevices().size();
                }
                return 0;
        }
}