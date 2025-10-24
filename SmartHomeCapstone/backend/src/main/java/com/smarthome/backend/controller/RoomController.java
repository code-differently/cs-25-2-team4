package com.smarthome.backend.controller;

import com.smarthome.backend.dto.RoomCreateRequest;
import com.smarthome.backend.dto.RoomResponse;
import com.smarthome.backend.entity.Room;
import com.smarthome.backend.service.RoomService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

        private final RoomService roomService;

        @Autowired
        public RoomController(RoomService roomService) {
                this.roomService = roomService;
        }

        // Create a new room: POST /api/rooms
        @PostMapping
        public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomCreateRequest request) {
                try {
                        Room room = roomService.createRoom(request);
                        RoomResponse response = new RoomResponse(room);
                        return ResponseEntity.status(HttpStatus.CREATED).body(response);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        // Get room by ID: GET /api/rooms/{id}
        @GetMapping("/{roomId}")
        public ResponseEntity<RoomResponse> getRoom(@PathVariable Long roomId) {
                Optional<Room> room = roomService.getRoomById(roomId);

                if (room.isPresent()) {
                        RoomResponse response = new RoomResponse(room.get());
                        return ResponseEntity.ok(response);
                } else {
                        return ResponseEntity.notFound().build();
                }
        }

        /**
         * Get all rooms or search rooms GET /api/rooms - Get all rooms GET /api/rooms?homeId={homeId} -
         * Get rooms for a specific home GET /api/rooms?clerkId={clerkId} - Get rooms for a specific
         * user (via access) GET /api/rooms?search={name} - Search rooms by name
         */
        @GetMapping
        public ResponseEntity<List<RoomResponse>> getRooms(
                        @RequestParam(required = false) Long homeId,
                        @RequestParam(required = false) String clerkId,
                        @RequestParam(required = false) String search) {
                List<Room> rooms;

                if (homeId != null) {
                        rooms = roomService.getRoomsByHomeId(homeId);
                } else if (clerkId != null) {
                        rooms = roomService.getRoomsByClerkId(clerkId);
                } else if (search != null && !search.trim().isEmpty()) {
                        rooms = roomService.searchRoomsByName(search);
                } else {
                        rooms = roomService.getAllRooms();
                }

                List<RoomResponse> response = rooms.stream().map(RoomResponse::new).toList();

                return ResponseEntity.ok(response);
        }

        // Update room: PUT /api/rooms/{id}
        @PutMapping("/{roomId}")
        public ResponseEntity<RoomResponse> updateRoom(
                        @PathVariable Long roomId, @Valid @RequestBody RoomCreateRequest request) {
                try {
                        Room room = roomService.updateRoom(roomId, request);
                        RoomResponse response = new RoomResponse(room);
                        return ResponseEntity.ok(response);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        // Delete a room: DELETE /api/rooms/{id}
        @DeleteMapping("/{roomId}")
        public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
                try {
                        roomService.deleteRoom(roomId);
                        return ResponseEntity.noContent().build();
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }

        // Get device count for a room: GET /api/rooms/{id}/device-count
        @GetMapping("/{roomId}/device-count")
        public ResponseEntity<Long> getDeviceCount(@PathVariable Long roomId) {
                try {
                        long count = roomService.getDeviceCountByRoomId(roomId);
                        return ResponseEntity.ok(count);
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }
}
