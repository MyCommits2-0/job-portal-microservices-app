package com.jobportal.wrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.*;

public class GatewayRequestWrapper extends HttpServletRequestWrapper {

    private final Map<String, String> customHeaders = new HashMap<>();
    private final Set<String> removedHeaders = new HashSet<>();

    public GatewayRequestWrapper(HttpServletRequest request) {
        super(request);
    }

    public void putHeader(String name, String value) {
        customHeaders.put(name, value);
        removedHeaders.remove(name.toLowerCase());
    }

    public void removeHeader(String name) {
        customHeaders.remove(name);
        removedHeaders.add(name.toLowerCase());
    }

    @Override
    public String getHeader(String name) {

        if (customHeaders.containsKey(name)) {
            return customHeaders.get(name);
        }

        if (removedHeaders.contains(name.toLowerCase())) {
            return null;
        }

        return super.getHeader(name);
    }

    @Override
    public Enumeration<String> getHeaders(String name) {

        if (customHeaders.containsKey(name)) {
            return Collections.enumeration(List.of(customHeaders.get(name)));
        }

        if (removedHeaders.contains(name.toLowerCase())) {
            return Collections.emptyEnumeration();
        }

        return super.getHeaders(name);
    }

    @Override
    public Enumeration<String> getHeaderNames() {

        Set<String> headerNames = new LinkedHashSet<>();

        Enumeration<String> originalHeaderNames = super.getHeaderNames();

        while (originalHeaderNames.hasMoreElements()) {
            String headerName = originalHeaderNames.nextElement();

            if (!removedHeaders.contains(headerName.toLowerCase())) {
                headerNames.add(headerName);
            }
        }

        headerNames.addAll(customHeaders.keySet());

        return Collections.enumeration(headerNames);
    }
}