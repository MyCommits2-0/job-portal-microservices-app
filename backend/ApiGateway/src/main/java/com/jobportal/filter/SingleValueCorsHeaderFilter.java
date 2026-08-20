package com.jobportal.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * Access-Control-Allow-Origin (and friends) must appear at most once per the Fetch spec;
 * browsers reject a response outright if it's duplicated. We kept hitting exactly that,
 * traced to more than one layer (security config, service-level config, and something
 * inside the gateway's own proxying) independently trying to add the same header on the
 * same response. Rather than keep chasing every source, this wraps the response as early
 * as possible so any addHeader() call for these specific headers always replaces instead
 * of appending, making duplication structurally impossible regardless of where it comes from.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SingleValueCorsHeaderFilter extends OncePerRequestFilter {

    private static final Set<String> SINGLE_VALUE_HEADERS = Set.of(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Access-Control-Expose-Headers",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers"
    );

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        HttpServletResponseWrapper wrapped = new HttpServletResponseWrapper(response) {
            @Override
            public void addHeader(String name, String value) {
                if (SINGLE_VALUE_HEADERS.contains(name)) {
                    setHeader(name, value);
                } else {
                    super.addHeader(name, value);
                }
            }
        };

        filterChain.doFilter(request, wrapped);
    }
}
