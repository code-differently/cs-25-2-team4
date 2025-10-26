package com.smarthome.backend.repository;

import com.smarthome.backend.entity.HomeMembership;
import com.smarthome.backend.enums.MembershipRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeMembershipRepository extends JpaRepository<HomeMembership, Long> {

        // Find membership by user clerkId and home ID
        @Query(
                        "SELECT hm FROM HomeMembership hm WHERE hm.user.clerkId = :clerkId AND hm.home.homeId ="
                                        + " :homeId")
        Optional<HomeMembership> findByClerkIdAndHomeId(
                        @Param("clerkId") String clerkId, @Param("homeId") Long homeId);

        // Find all memberships for a user
        @Query("SELECT hm FROM HomeMembership hm WHERE hm.user.clerkId = :clerkId")
        List<HomeMembership> findByClerkId(@Param("clerkId") String clerkId);

        // Find all memberships for a home
        @Query("SELECT hm FROM HomeMembership hm WHERE hm.home.homeId = :homeId")
        List<HomeMembership> findByHomeId(@Param("homeId") Long homeId);

        // Find memberships by role
        @Query("SELECT hm FROM HomeMembership hm WHERE hm.role = :role")
        List<HomeMembership> findByRole(@Param("role") MembershipRole role);

        // Check if user has specific role in home
        @Query(
                        "SELECT CASE WHEN COUNT(hm) > 0 THEN true ELSE false END FROM HomeMembership hm WHERE"
                                + " hm.user.clerkId = :clerkId AND hm.home.homeId = :homeId AND hm.role = :role")
        boolean existsByClerkIdAndHomeIdAndRole(
                        @Param("clerkId") String clerkId,
                        @Param("homeId") Long homeId,
                        @Param("role") MembershipRole role);

        // Check if user is member of home (any role)
        @Query(
                        "SELECT CASE WHEN COUNT(hm) > 0 THEN true ELSE false END FROM HomeMembership hm WHERE"
                                        + " hm.user.clerkId = :clerkId AND hm.home.homeId = :homeId")
        boolean existsByClerkIdAndHomeId(
                        @Param("clerkId") String clerkId, @Param("homeId") Long homeId);

        // Count total members in a home
        @Query("SELECT COUNT(hm) FROM HomeMembership hm WHERE hm.home.homeId = :homeId")
        long countByHomeId(@Param("homeId") Long homeId);

        // Count admins in a home
        @Query(
                        "SELECT COUNT(hm) FROM HomeMembership hm WHERE hm.home.homeId = :homeId AND hm.role ="
                                        + " :role")
        long countByHomeIdAndRole(@Param("homeId") Long homeId, @Param("role") MembershipRole role);
}
