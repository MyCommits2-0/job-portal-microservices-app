package com.backend.app.dto;

import java.time.LocalDateTime;

import com.backend.app.enums.ApplicationStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusHistoryResponse {

    private Long id;

    private ApplicationStatus oldStatus;

    private ApplicationStatus newStatus;

    private Long changedBy;

    private LocalDateTime changedAt;

}
