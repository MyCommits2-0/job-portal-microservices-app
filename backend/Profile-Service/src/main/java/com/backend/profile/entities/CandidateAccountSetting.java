package com.backend.profile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "candidate_account_settings")
@Getter
@Setter
@NoArgsConstructor
public class CandidateAccountSetting extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_profile_id", nullable = false, unique = true)
    private CandidateProfile candidate;

    @Column(name = "profile_visible")
    private boolean profileVisible = true;

    @Column(name = "job_alert_enabled")
    private boolean jobAlertEnabled = true;

    @Column(name = "email_notification_enabled")
    private boolean emailNotificationEnabled = true;
}