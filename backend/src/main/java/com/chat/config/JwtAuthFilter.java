package com.chat.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.chat.utils.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 🔥 1. PUBLIC ROUTES SKIP
        if (path.startsWith("/api/auth") ||
            path.startsWith("/ws") ||
            path.startsWith("/uploads") ||
            path.startsWith("/error")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        // 🔥 2. NO TOKEN → SKIP
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String phoneNumber = null;

        // 🔥 3. EXTRACT TOKEN SAFE
        try {
            phoneNumber = jwtUtil.extractPhone(token);
        } catch (Exception e) {
            System.out.println("JWT PARSE ERROR: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        // 🔥 4. AUTH SET
        if (phoneNumber != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(phoneNumber);

                // validate token
                if (!jwtUtil.validateToken(token, userDetails.getUsername())) {
                    filterChain.doFilter(request, response);
                    return;
                }

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authToken);

            } catch (Exception e) {
                // 🔥 MOST IMPORTANT (NO CRASH)
                System.out.println("JWT USER ERROR: " + e.getMessage());
                filterChain.doFilter(request, response);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}