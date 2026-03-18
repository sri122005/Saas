package com.saas.multitenant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.saas.multitenant.model")
@EnableJpaRepositories("com.saas.multitenant.repository")
public class MultiTenantSaasApplication {

    public static void main(String[] args) {
        SpringApplication.run(MultiTenantSaasApplication.class, args);
    }

}
