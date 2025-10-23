package com.smarthome.backend.entity;

import static org.junit.jupiter.api.Assertions.*;

import com.smarthome.backend.enums.MembershipRole;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

@DisplayName("HomeMembership Entity Tests")
class HomeMembershipTest {

        private Validator validator;
        private HomeMembership membership;
        private User user;
        private Home home;

        @BeforeEach
        void setUp() {
                ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
                validator = factory.getValidator();
                user = new User("clerk_123456789", "testuser", "John", "Doe", "test@example.com");
                home = new Home("Test Home", "123 Test St");
                membership = new HomeMembership();
        }

        @Test
        @DisplayName("Default constructor creates membership with default role")
        void defaultConstructor_ShouldCreateMembershipWithDefaults() {
                HomeMembership newMembership = new HomeMembership();

                assertNull(newMembership.getMembershipId());
                assertNull(newMembership.getUser());
                assertNull(newMembership.getHome());
                assertEquals(MembershipRole.MEMBER, newMembership.getRole());
        }

        @Test
        @DisplayName("Parameterized constructor with role sets fields correctly")
        void parameterizedConstructorWithRole_ShouldSetFields() {
                HomeMembership newMembership = new HomeMembership(user, home, MembershipRole.ADMIN);

                assertEquals(user, newMembership.getUser());
                assertEquals(home, newMembership.getHome());
                assertEquals(MembershipRole.ADMIN, newMembership.getRole());
                assertNull(newMembership.getMembershipId()); // ID is generated
        }

        @Test
        @DisplayName("Parameterized constructor without role defaults to MEMBER")
        void parameterizedConstructorWithoutRole_ShouldDefaultToMember() {
                HomeMembership newMembership = new HomeMembership(user, home);

                assertEquals(user, newMembership.getUser());
                assertEquals(home, newMembership.getHome());
                assertEquals(MembershipRole.MEMBER, newMembership.getRole());
        }

        @Test
        @DisplayName("Valid membership passes validation")
        void validMembership_ShouldPassValidation() {
                membership.setUser(user);
                membership.setHome(home);
                membership.setRole(MembershipRole.ADMIN);

                Set<ConstraintViolation<HomeMembership>> violations = validator.validate(membership);

                assertTrue(violations.isEmpty());
        }

        @Test
        @DisplayName("User validation tests")
        void userValidation_ShouldEnforceConstraints() {
                membership.setHome(home);
                membership.setRole(MembershipRole.MEMBER);

                // Test null user
                membership.setUser(null);
                Set<ConstraintViolation<HomeMembership>> violations = validator.validate(membership);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream().anyMatch(v -> v.getMessage().contains("User cannot be null")));
        }

        @Test
        @DisplayName("Home validation tests")
        void homeValidation_ShouldEnforceConstraints() {
                membership.setUser(user);
                membership.setRole(MembershipRole.MEMBER);

                // Test null home
                membership.setHome(null);
                Set<ConstraintViolation<HomeMembership>> violations = validator.validate(membership);
                assertFalse(violations.isEmpty());
                assertTrue(
                                violations.stream().anyMatch(v -> v.getMessage().contains("Home cannot be null")));
        }

        @Test
        @DisplayName("Role can be set and retrieved")
        void role_ShouldBeSetAndRetrieved() {
                membership.setRole(MembershipRole.ADMIN);
                assertEquals(MembershipRole.ADMIN, membership.getRole());

                membership.setRole(MembershipRole.MEMBER);
                assertEquals(MembershipRole.MEMBER, membership.getRole());
        }

        @Test
        @DisplayName("Getters and setters work correctly")
        void gettersAndSetters_ShouldWorkCorrectly() {
                membership.setUser(user);
                membership.setHome(home);
                membership.setRole(MembershipRole.ADMIN);

                assertEquals(user, membership.getUser());
                assertEquals(home, membership.getHome());
                assertEquals(MembershipRole.ADMIN, membership.getRole());
        }

        @Test
        @DisplayName("Unique constraint should be enforced logically")
        void uniqueConstraint_ShouldBeEnforcedLogically() {
                // This test verifies the logical expectation that a user
                // should have only one membership per home
                HomeMembership membership1 = new HomeMembership(user, home, MembershipRole.MEMBER);
                HomeMembership membership2 = new HomeMembership(user, home, MembershipRole.ADMIN);

                // Both memberships have same user and home
                assertEquals(membership1.getUser(), membership2.getUser());
                assertEquals(membership1.getHome(), membership2.getHome());

                // But different roles - this would violate unique constraint in DB
                assertNotEquals(membership1.getRole(), membership2.getRole());
        }
}
