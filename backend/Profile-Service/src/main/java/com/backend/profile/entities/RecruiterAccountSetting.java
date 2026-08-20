package com.backend.profile.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recruiter_account_settings")
@Getter
@Setter
@NoArgsConstructor
public class RecruiterAccountSetting extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_profile_id", nullable = false, unique = true)
    private RecruiterProfile recruiter;

    @Column(name = "company_visible")
    private boolean companyVisible = true;

    @Column(name = "applicant_email_enabled")
    private boolean applicantEmailEnabled = true;

    @Column(name = "email_notification_enabled")
    private boolean emailNotificationEnabled = true;
}
