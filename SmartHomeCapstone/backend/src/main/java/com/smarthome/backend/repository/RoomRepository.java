package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Find rooms by home
    List<Room> findByHome_HomeId(Long homeId);

    // Find rooms by name (case insensitive)
    List<Room> findByNameContainingIgnoreCase(String name);

    // Check if room name exists in a home
    boolean existsByNameAndHome_HomeId(String name, Long homeId);

    // Count rooms in a home
    long countByHome_HomeId(Long homeId);

    // Find rooms that a user has access to
    @Query("SELECT r FROM Room r JOIN r.roomAccesses ra WHERE ra.user.userId = :userId")
    List<Room> findRoomsByUserId(@Param("userId") Long userId);
}