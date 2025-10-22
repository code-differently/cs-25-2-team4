package com.smarthome.backend.config;

import com.smarthome.backend.entity.*;
import com.smarthome.backend.repository.DeviceRepository;
import com.smarthome.backend.repository.HomeRepository;
import com.smarthome.backend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

        @Autowired private HomeRepository homeRepository;

        @Autowired private RoomRepository roomRepository;

        @Autowired private DeviceRepository deviceRepository;

        @Override
        public void run(String... args) throws Exception {
                // Create sample homes
                if (homeRepository.count() == 0) {
                        Home home1 = new Home("My Smart Home", "123 Main Street, Anytown, USA");

                        homeRepository.save(home1);

                        // Create sample rooms for the first home
                        Room livingRoom = new Room(home1, "Living Room");
                        Room kitchen = new Room(home1, "Kitchen");
                        Room bedroom = new Room(home1, "Master Bedroom");
                        Room bathroom = new Room(home1, "Bathroom");

                        roomRepository.save(livingRoom);
                        roomRepository.save(kitchen);
                        roomRepository.save(bedroom);
                        roomRepository.save(bathroom);

                        // Create sample devices
                        Light livingRoomLight = new Light("Living Room Light", livingRoom);
                        livingRoomLight.setBrightness(75);
                        livingRoomLight.setColorHex("#FFDD44");

                        Thermostat bedroomThermostat = new Thermostat("Bedroom Thermostat", bedroom);
                        bedroomThermostat.setTargetTemp(72.0);

                        SecurityCamera securityCamera = new SecurityCamera("Security Camera", livingRoom);
                        securityCamera.setStreamUrl("http://example.com/camera/stream");
                        securityCamera.setResolution("1080p");

                        deviceRepository.save(livingRoomLight);
                        deviceRepository.save(bedroomThermostat);
                        deviceRepository.save(securityCamera);

                        System.out.println("Sample data loaded successfully!");
                        System.out.println("Created homes: " + homeRepository.count());
                        System.out.println("Created rooms: " + roomRepository.count());
                        System.out.println("Created devices: " + deviceRepository.count());
                }
        }
}
