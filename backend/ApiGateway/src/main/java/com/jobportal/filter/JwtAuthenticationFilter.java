package com.jobportal.filter;

import com.jobportal.service.JwtUtil;
import com.jobportal.wrapper.GatewayRequestWrapper;

import io.jsonwebtoken.Claims;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        GatewayRequestWrapper wrappedRequest = new GatewayRequestWrapper(request);

        /*
         * Remove fake user headers sent by frontend/client.
         * Gateway should be the only trusted source of these headers.
         */
        wrappedRequest.removeHeader("X-User-Id");
        wrappedRequest.removeHeader("X-User-Email");
        wrappedRequest.removeHeader("X-User-Role");

        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        /*
         * If token is missing, let Spring Security block it using SecurityConfig rules.
         */
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(wrappedRequest, response);
            return;
        }

        String token = authHeader.substring(7);

        // Only actual JWT parsing/validation is caught here. filterChain.doFilter() (below,
        // outside this try) triggers routing to the downstream service — if that fails (e.g.
        // the target service isn't running/registered), that exception must NOT be swallowed
        // and reported as "Invalid or expired token": it has nothing to do with the token and
        // that message actively hides the real problem.
        Claims claims;
        try {
            claims = jwtUtil.extractClaims(token);
        } catch (Exception e) {
            sendUnauthorizedResponse(response, "Invalid or expired token");
            return;
        }

        Object userIdClaim = claims.get("userId");
        String email = claims.getSubject();
        Object roleClaim = claims.get("role");

        if (userIdClaim == null || email == null || roleClaim == null) {
            sendUnauthorizedResponse(response, "Invalid token claims");
            return;
        }

        String userId = String.valueOf(userIdClaim);
        String role = String.valueOf(roleClaim);

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        /*
         * These trusted headers will be forwarded to downstream services.
         */
        wrappedRequest.putHeader("X-User-Id", userId);
        wrappedRequest.putHeader("X-User-Email", email);
        wrappedRequest.putHeader("X-User-Role", role);

        filterChain.doFilter(wrappedRequest, response);
    }

    private void sendUnauthorizedResponse(
            HttpServletResponse response,
            String message
    ) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}