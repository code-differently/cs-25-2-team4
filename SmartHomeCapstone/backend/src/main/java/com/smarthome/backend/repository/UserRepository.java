package com.smarthome.backend.repository;

import com.smarthome.backend.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

        Optional<User> findByClerkId(String clerkId);

        Optional<User> findByUsername(String username);

        Optional<User> findByEmail(String email);

        boolean existsByClerkId(String clerkId);

        boolean existsByUsername(String username);

        boolean existsByEmail(String email);
}
