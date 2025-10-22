package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Room;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

        List<Room> findByHome_HomeId(Long homeId);

        List<Room> findByNameContainingIgnoreCase(String name);

        boolean existsByNameAndHome_HomeId(String name, Long homeId);

        long countByHome_HomeId(Long homeId);

        // Find rooms that a user has access to
        @Query("SELECT r FROM Room r JOIN r.roomAccesses ra WHERE ra.user.clerkId = :clerkId")
        List<Room> findRoomsByClerkId(@Param("clerkId") String clerkId);
}
