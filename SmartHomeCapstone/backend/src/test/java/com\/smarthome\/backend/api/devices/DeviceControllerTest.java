package com.smarthome.backend.api.devices;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
class DeviceControllerTest {
  @Autowired private MockMvc mvc;
  @Autowired private ObjectMapper om;

  @Test
  void listInitiallyEmpty() throws Exception {
    mvc.perform(get("/api/devices")).andExpect(status().isOk()).andExpect(content().json("[]"));
  }

  @Test
  void addThenListAndDelete() throws Exception {
    DeviceCreateRequest req = new DeviceCreateRequest("Thermostat","THERMO");
    String body = om.writeValueAsString(req);
    String created = mvc.perform(post("/api/devices").contentType(MediaType.APPLICATION_JSON).content(body))
      .andExpect(status().isCreated())
      .andExpect(jsonPath("$.id").exists())
      .andExpect(jsonPath("$.name").value("Thermostat"))
      .andExpect(jsonPath("$.type").value("THERMO"))
      .andExpect(jsonPath("$.online").value(true))
      .andReturn().getResponse().getContentAsString();

    String id = om.readTree(created).get("id").asText();

    mvc.perform(get("/api/devices"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].id").value(id));

    mvc.perform(delete("/api/devices/" + id)).andExpect(status().isNoContent());
  }
}
