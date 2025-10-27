package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Home;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeRepository extends JpaRepository<Home, Long> {

        List<Home> findByNameContainingIgnoreCase(String name);


        // Find homes that a user has access to through HomeMembership
        @Query("SELECT h FROM Home h JOIN h.homeMemberships hm WHERE hm.user.clerkId = :clerkId")
        List<Home> findHomesByClerkId(@Param("clerkId") String clerkId);

        // Find homes by address
        List<Home> findByAddressContainingIgnoreCase(String address);

        // Count rooms in a home
        @Query("SELECT COUNT(r) FROM Room r WHERE r.home.homeId = :homeId")
        long countRoomsByHomeId(@Param("homeId") Long homeId);
}
