package com.archipellibre.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Root controller for API info and health checks
 */
@RestController
public class RootController {
    
    /**
     * Root endpoint - returns API information
     */
    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(new ApiInfo());
    }
    
    public static class ApiInfo {
        public String name = "L'Archipel Libre API";
        public String version = "1.0.0";
        public String description = "Community platform API";
        public String docs = "/swagger-ui.html";
        public String status = "running";
    }
}
