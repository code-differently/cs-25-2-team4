package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Device;
import com.smarthome.backend.enums.DeviceStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

        List<Device> findByRoom_RoomId(Long roomId);

        List<Device> findByDeviceNameContainingIgnoreCase(String deviceName);

        List<Device> findByStatus(DeviceStatus status);

        // Find devices by type (discriminator)
        @Query("SELECT d FROM Device d WHERE TYPE(d) = :deviceType")
        List<Device> findByDeviceType(@Param("deviceType") Class<? extends Device> deviceType);

        // Find devices in a specific home
        @Query("SELECT d FROM Device d WHERE d.room.home.homeId = :homeId")
        List<Device> findByHomeId(@Param("homeId") Long homeId);

        long countByRoom_RoomId(Long roomId);

        // Check if device name exists in a room
        boolean existsByDeviceNameAndRoom_RoomId(String deviceName, Long roomId);
}
