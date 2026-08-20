package com.jobportal.config;

import com.jobportal.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Comma-separated list, e.g. "http://localhost:5173,http://<VM-IP>:5173" - a
    // deployed frontend is served from something other than localhost, and the
    // browser's CORS check fails closed (not an error the JWT filter would ever see)
    // if its origin isn't in this list.
    @Value("#{'${cors.allowed-origins:http://localhost:5173}'.split(',')}")
    private List<String> allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    	http.csrf(csrf -> csrf.disable());
    	http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
		// 2. Retain basic auth scheme (disable form based auth)
	//	http.httpBasic(Customizer.withDefaults());
		// 3. Disable HttpSession (Tell Spring sec - DO NOT create HttpSession object
		// to store Spring security context holder
		http.sessionManagement(session -> 
		session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// 4. Add a rule - all endpoints - secured (requires Authentication)
		http.authorizeHttpRequests(auth -> auth
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				.requestMatchers("/actuator/health").permitAll()
				.requestMatchers(
						"/auth/register",
						"/auth/login",
						"/auth/verify-email",
						"/auth/forgot-password",
						"/auth/reset-password",
						"/auth/refresh-token",
						"/auth/logout"
				).permitAll()
				// Single-path-segment matcher: covers /jobs/search, /jobs/home, and
				// /jobs/{jobId} (public browsing/details) without opening up the
				// multi-segment /jobs/recruiter/** routes, which stay authenticated.
				.requestMatchers(HttpMethod.GET, "/jobs/*").permitAll()
				// .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
				// .requestMatchers(HttpMethod.POST,"/jobs/recruiter").hasRole("RECRUITER")
				.anyRequest().authenticated()
				)

			.cors(Customizer.withDefaults())

			.addFilterBefore(jwtAuthenticationFilter,
				UsernamePasswordAuthenticationFilter.class);
		return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        return request -> {
            CorsConfiguration config = new CorsConfiguration();

            config.setAllowedOrigins(allowedOrigins);
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
            config.setExposedHeaders(List.of("Authorization"));
            config.setAllowCredentials(true);

            return config;
        };
    }
}