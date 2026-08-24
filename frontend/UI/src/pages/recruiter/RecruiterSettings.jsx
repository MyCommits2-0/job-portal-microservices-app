import { useEffect, useState } from "react";

import RecruiterSettingsTabs from "../../components/recruiter/settings/RecruiterSettingsTabs";
import CompanyInfoSettings from "../../components/recruiter/settings/CompanyInfoSettings";
import FoundingInfoSettings from "../../components/recruiter/settings/FoundingInfoSettings";
import RecruiterSocialSettings from "../../components/recruiter/settings/RecruiterSocialSettings";
import RecruiterAccountSettings from "../../components/recruiter/settings/RecruiterAccountSettings";

import {
  getRecruiterSettings,
  resolveRecruiterProfileId,
} from "../../services/recruiterSettingsService";

export default function RecruiterSettings() {
  const [activeTab, setActiveTab] = useState("company");
  const [loading, setLoading] = useState(true);

  const [recruiterProfileId, setRecruiterProfileId] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    logo: "",
    banner: "",
    companyName: "",
    aboutUs: "",
  });

  const [foundingInfo, setFoundingInfo] = useState({
    organizationType: "",
    industryType: "",
    teamSize: "",
    yearOfEstablishment: "",
    companyWebsite: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [accountSettings, setAccountSettings] = useState({
    companyVisible: true,
    applicantEmailEnabled: true,
    emailNotificationEnabled: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);

        const profileId = await resolveRecruiterProfileId();
        setRecruiterProfileId(profileId);

        const recruiter = await getRecruiterSettings(profileId);
        const company = recruiter.company || {};

        setCompanyInfo({
          logo: company.logo || "",
          banner: company.banner || "",
          companyName: company.companyName || "",
          aboutUs: company.about || "",
        });

        setFoundingInfo({
          organizationType: company.organizationType || "",
          industryType: company.industryType || "",
          teamSize: company.teamSize || "",
          yearOfEstablishment: company.yearOfEstablishment
            ? `${company.yearOfEstablishment}-01-01`
            : "",
          companyWebsite: company.website || "",
        });

        setSocialLinks({
          facebook: company.facebook || "",
          twitter: company.twitter || "",
          linkedin: company.linkedin || "",
          instagram: company.instagram || "",
        });

        setAccountSettings({
          companyVisible:
            recruiter.accountSetting?.companyVisible ?? true,
          applicantEmailEnabled:
            recruiter.accountSetting?.applicantEmailEnabled ?? true,
          emailNotificationEnabled:
            recruiter.accountSetting?.emailNotificationEnabled ?? true,
        });
      } catch (error) {
        console.error("Failed to fetch recruiter settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "company":
        return (
          <CompanyInfoSettings
            recruiterProfileId={recruiterProfileId}
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
          />
        );

      case "founding":
        return (
          <FoundingInfoSettings
            recruiterProfileId={recruiterProfileId}
            foundingInfo={foundingInfo}
            setFoundingInfo={setFoundingInfo}
          />
        );

      case "social":
        return (
          <RecruiterSocialSettings
            recruiterProfileId={recruiterProfileId}
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
          />
        );

      case "account":
        return (
          <RecruiterAccountSettings
            recruiterProfileId={recruiterProfileId}
            accountSettings={accountSettings}
            setAccountSettings={setAccountSettings}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Settings
      </h1>

      <RecruiterSettingsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {loading ? (
        <div className="py-20 text-center text-gray-500">
          Loading settings...
        </div>
      ) : (
        renderTabContent()
      )}
    </>
  );
}