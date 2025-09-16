import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SecurityCameraTest {
    private SecurityCamera camera;

    @BeforeEach
    void setUp() {
        camera = new SecurityCamera("C1", "Front Door Camera");
    }

    @Test
    void testCameraRecording() {
        camera.startRecording();
        assertTrue(camera.isRecording(), "Camera should be recording after startRecording()");
        camera.stopRecording();
        assertFalse(camera.isRecording(), "Camera should not be recording after stopRecording()");
    }

    @Test
    void testCameraMotionDetection() {
        camera.detectMotion();
        assertTrue(camera.isMotionDetected(), "Camera should detect motion after detectMotion()");
    }
}
