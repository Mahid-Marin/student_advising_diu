package com.academicatelier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AcademicAtelierApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademicAtelierApplication.class, args);
    }

}
