package com.smarthome.backend.controller;

import com.smarthome.backend.dto.HomeCreateRequest;
import com.smarthome.backend.dto.HomeResponse;
import com.smarthome.backend.entity.Home;
import com.smarthome.backend.service.HomeService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/homes")
public class HomeController {

        private final HomeService homeService;

        @Autowired
        public HomeController(HomeService homeService) {
                this.homeService = homeService;
        }

        // Create a new home: /api/homes
        @PostMapping
        public ResponseEntity<HomeResponse> createHome(@Valid @RequestBody HomeCreateRequest request) {
                try {
                        Home home = homeService.createHome(request);
                        HomeResponse response = new HomeResponse(home);
                        return ResponseEntity.status(HttpStatus.CREATED).body(response);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        // Get home by ID: /api/homes/{id}
        @GetMapping("/{homeId}")
        public ResponseEntity<HomeResponse> getHome(@PathVariable Long homeId) {
                Optional<Home> home = homeService.getHomeById(homeId);

                if (home.isPresent()) {
                        HomeResponse response = new HomeResponse(home.get());
                        return ResponseEntity.ok(response);
                } else {
                        return ResponseEntity.notFound().build();
                }
        }

        /**
         * Get all homes or search homes GET /api/homes - Get all homes GET /api/homes?clerkId={clerkId} -
         * Get homes for a specific user GET /api/homes?search={name} - Search homes by name GET
         * /api/homes?address={address} - Search homes by address
         */
        @GetMapping
        public ResponseEntity<List<HomeResponse>> getHomes(
                        @RequestParam(required = false) String clerkId,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) String address) {
                List<Home> homes;

                if (clerkId != null) {
                        homes = homeService.getHomesByClerkId(clerkId);
                } else if (search != null && !search.trim().isEmpty()) {
                        homes = homeService.searchHomesByName(search);
                } else if (address != null && !address.trim().isEmpty()) {
                        homes = homeService.searchHomesByAddress(address);
                } else {
                        homes = homeService.getAllHomes();
                }

                List<HomeResponse> response = homes.stream().map(HomeResponse::new).toList();

                return ResponseEntity.ok(response);
        }

        // Update home: /api/homes/{id}
        @PutMapping("/{homeId}")
        public ResponseEntity<HomeResponse> updateHome(
                        @PathVariable Long homeId, @Valid @RequestBody HomeCreateRequest request) {
                try {
                        Home home = homeService.updateHome(homeId, request);
                        HomeResponse response = new HomeResponse(home);
                        return ResponseEntity.ok(response);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        // Delete a home: /api/homes/{id}
        @DeleteMapping("/{homeId}")
        public ResponseEntity<Void> deleteHome(@PathVariable Long homeId) {
                try {
                        homeService.deleteHome(homeId);
                        return ResponseEntity.noContent().build();
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }

        // Get room count for a home: /api/homes/{id}/room-count
        @GetMapping("/{homeId}/room-count")
        public ResponseEntity<Long> getRoomCount(@PathVariable Long homeId) {
                try {
                        long count = homeService.getRoomCountByHomeId(homeId);
                        return ResponseEntity.ok(count);
                } catch (RuntimeException e) {
                        return ResponseEntity.notFound().build();
                }
        }
}
