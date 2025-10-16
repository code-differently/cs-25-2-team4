package com.smarthome.backend.api.devices;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;
@RestController
@RequestMapping("/api/devices")
public class DeviceController {
  private final DeviceService service;
  public DeviceController(DeviceService service) { this.service = service; }
  @GetMapping
  public List<Device> list() { return service.list(); }
  @PostMapping
  public ResponseEntity<Device> add(@RequestBody DeviceCreateRequest req) {
    Device d = service.add(req.getName(), req.getType());
    return ResponseEntity.created(URI.create("/api/devices/" + d.getId())).body(d);
  }
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> remove(@PathVariable String id) {
    service.remove(id);
    return ResponseEntity.noContent().build();
  }
}
