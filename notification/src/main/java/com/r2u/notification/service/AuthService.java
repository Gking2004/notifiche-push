package com.r2u.notification.service;

import com.r2u.notification.dto.request.LoginRequest;
import com.r2u.notification.dto.request.SignupRequest;
import com.r2u.notification.dto.response.AuthResponse;
import com.r2u.notification.entity.UserEntity;
import com.r2u.notification.repository.UserRepository;
import com.r2u.notification.exception.UserAlreadyExistsException;
import com.r2u.notification.exception.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    // ── Ottieni token admin per chiamare la Admin API ─────────────────────
    private String getAdminToken() {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", "admin-cli");
        formData.add("username", adminUsername);
        formData.add("password", adminPassword);

        Map response = webClientBuilder.build()
            .post()
            .uri(keycloakUrl + "/realms/master/protocol/openid-connect/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(BodyInserters.fromFormData(formData))
            .retrieve()
            .bodyToMono(Map.class)
            .block();

        return (String) response.get("access_token");
    }

    // ── Registrazione ─────────────────────────────────────────────────────
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Signing up user: {}", request.getUsername());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("L'utente con questo username esiste già");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("L'utente con questa email esiste già");
        }

        String adminToken = getAdminToken();

        // Crea utente su Keycloak
        Map<String, Object> keycloakUser = Map.of(
            "username", request.getUsername(),
            "email", request.getEmail(),
            "enabled", true,
            "emailVerified", true,
            "credentials", List.of(Map.of(
                "type", "password",
                "value", request.getPassword(),
                "temporary", false
            )),
            "requiredActions", List.of()
        );

        try {
            webClientBuilder.build()
                .post()
                .uri(keycloakUrl + "/admin/realms/" + realm + "/users")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(keycloakUser)
                .retrieve()
                .toBodilessEntity()
                .block();
        } catch (WebClientResponseException e) {
            log.error("Errore durante la creazione dell'utente su Keycloak: {}", e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 409) {
                throw new UserAlreadyExistsException("L'utente con questo username o email esiste già su Keycloak");
            }
            throw new RuntimeException("Errore durante la registrazione su Keycloak: " + e.getMessage(), e);
        }

        // Salva nel DB locale (senza password)
        UserEntity user = new UserEntity();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        userRepository.save(user);

        // Fai subito login per restituire il token
        return login(new LoginRequest(request.getUsername(), request.getPassword()));
    }

    // ── Login ─────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {
        log.info("Logging in user: {}", request.getUsername());

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "password");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("username", request.getUsername());
        formData.add("password", request.getPassword());

        try {
            Map response = webClientBuilder.build()
                .post()
                .uri(keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();

            AuthResponse authResponse = new AuthResponse();
            authResponse.setUsername(request.getUsername());
            authResponse.setToken((String) response.get("access_token"));
            return authResponse;
        } catch (WebClientResponseException e) {
            log.error("Errore di login per l'utente {}: {}", request.getUsername(), e.getResponseBodyAsString());
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 400) {
                throw new InvalidCredentialsException("Credenziali non valide o utente non trovato");
            }
            throw new RuntimeException("Errore durante il login su Keycloak: " + e.getMessage(), e);
        }
    }
}