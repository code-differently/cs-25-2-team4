package com.smarthome.backend.service;

import com.smarthome.backend.dto.HomeCreateRequest;
import com.smarthome.backend.entity.Home;
import com.smarthome.backend.entity.HomeMembership;
import com.smarthome.backend.entity.User;
import com.smarthome.backend.enums.MembershipRole;
import com.smarthome.backend.repository.HomeMembershipRepository;
import com.smarthome.backend.repository.HomeRepository;
import com.smarthome.backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HomeService {

        private final HomeRepository homeRepository;
        private final HomeMembershipRepository homeMembershipRepository;
        private final UserRepository userRepository;

        @Autowired
        public HomeService(
                        HomeRepository homeRepository,
                        HomeMembershipRepository homeMembershipRepository,
                        UserRepository userRepository) {
                this.homeRepository = homeRepository;
                this.homeMembershipRepository = homeMembershipRepository;
                this.userRepository = userRepository;
        }

        // Create a new home
        public Home createHome(HomeCreateRequest request) {
                // Check if home with same name already exists
                if (homeRepository.existsByName(request.getName())) {
                        throw new RuntimeException("Home with name '" + request.getName() + "' already exists");
                }

                // Verify user exists
                Optional<User> userOpt = userRepository.findById(request.getClerkId());
                if (userOpt.isEmpty()) {
                        throw new RuntimeException("User not found with clerkId: " + request.getClerkId());
                }

                User user = userOpt.get();
                Home home = new Home(request.getName(), request.getAddress());
                Home savedHome = homeRepository.save(home);

                // Create home membership with ADMIN role for the creator
                HomeMembership membership = new HomeMembership(user, savedHome, MembershipRole.ADMIN);
                homeMembershipRepository.save(membership);

                return savedHome;
        }

        // Get home by ID
        public Optional<Home> getHomeById(Long homeId) {
                return homeRepository.findById(homeId);
        }

        // Get all homes
        public List<Home> getAllHomes() {
                return homeRepository.findAll();
        }

        // Get homes for a specific user
        public List<Home> getHomesByClerkId(String clerkId) {
                return homeRepository.findHomesByClerkId(clerkId);
        }

        // Search homes by name
        public List<Home> searchHomesByName(String name) {
                return homeRepository.findByNameContainingIgnoreCase(name);
        }

        // Search homes by address
        public List<Home> searchHomesByAddress(String address) {
                return homeRepository.findByAddressContainingIgnoreCase(address);
        }

        // Update home
        public Home updateHome(Long homeId, HomeCreateRequest request) {
                Optional<Home> existingHome = homeRepository.findById(homeId);
                if (existingHome.isEmpty()) {
                        throw new RuntimeException("Home not found with ID: " + homeId);
                }

                Home home = existingHome.get();

                // Check if new name conflicts with existing home
                if (!home.getName().equals(request.getName())
                                && homeRepository.existsByName(request.getName())) {
                        throw new RuntimeException("Home with name '" + request.getName() + "' already exists");
                }

                home.setName(request.getName());
                home.setAddress(request.getAddress());

                return homeRepository.save(home);
        }

        // Delete home
        public void deleteHome(Long homeId) {
                if (!homeRepository.existsById(homeId)) {
                        throw new RuntimeException("Home not found with ID: " + homeId);
                }
                homeRepository.deleteById(homeId);
        }

        // Get room count for a home
        public long getRoomCountByHomeId(Long homeId) {
                return homeRepository.countRoomsByHomeId(homeId);
        }
}
