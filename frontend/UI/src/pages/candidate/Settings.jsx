import { useEffect, useState } from "react";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";

import SettingsTabs from "../../components/candidate/settings/SettingsTabs";
import PersonalSettings from "../../components/candidate/settings/PersonalSettings";
import ProfileSettings from "../../components/candidate/settings/ProfileSettings";
import SocialLinksSettings from "../../components/candidate/settings/SocialLinksSettings";
import AccountSettings from "../../components/candidate/settings/AccountSettings";
import Loader from "../../components/common/Loader";
import { getCandidateSettings, resolveCandidateProfileId } from "../../services/candidateSettingsService";


export default function Settings() {

  const [activeTab, setActiveTab] = useState("personal");

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [candidateProfileId, setCandidateProfileId] = useState(null);

  const [profile, setProfile] = useState({

    phone: "",
    profileTitle: "",
    profileImageUrl: "",
    profileImage: null,
    location: "",
    bio: "",
    expectedSalary: "",
    experienceLevel: ""
  });

  const [educationList, setEducationList] = useState([]);

  const [experienceList, setExperienceList] = useState([]);

  const [skills, setSkills] = useState([]);

  const [resumes, setResumes] = useState([]);

  const [socialLinks, setSocialLinks] = useState([]);

  const [accountSettings, setAccountSettings] = useState({
    profileVisible: true,
    jobAlertEnabled: true,
    emailNotificationEnabled: true
  });

  const [completedTabs, setCompletedTabs] = useState([]);

  const goToTab = (tabId) => {
    setCompletedTabs((prev) => (prev.includes(activeTab) ? prev : [...prev, activeTab]));
    setActiveTab(tabId);
  };

  useEffect(() => {
    loadCandidateSettings();
  }, []);


  const loadCandidateSettings = async () => {
    try {
      setLoading(true);
      setLoadError(false);

      const resolvedCandidateProfileId = await resolveCandidateProfileId();
      const response = await getCandidateSettings(resolvedCandidateProfileId);

      const candidate =
        response.data || response;

      setCandidateProfileId(
        candidate.id
      );

      setProfile({
        phone: candidate.phone ?? "",
        profileTitle:
          candidate.profileTitle ?? "",

        profileImageUrl:
          candidate.profileImageUrl ?? "",

        profileImage:null,

        location:
          candidate.location ?? "",

        bio:
          candidate.bio ?? "",

        expectedSalary:
          candidate.expectedSalary ?? "",

        experienceLevel:
          candidate.experienceLevel ?? ""

      });

      setEducationList(
        candidate.educationList ?? []
      );

      setExperienceList(
        candidate.experienceList ?? []
      );

      setSkills(
        candidate.candidateSkills ?? []
      );

      setResumes(
        candidate.resumes ?? []
      );

      setSocialLinks(
        candidate.socialLinks ?? []
      );

      setAccountSettings({

        profileVisible:
          candidate.accountSetting
          ?.profileVisible ?? true,

        jobAlertEnabled:
          candidate.accountSetting
          ?.jobAlertEnabled ?? true,

        emailNotificationEnabled:
          candidate.accountSetting
          ?.emailNotificationEnabled ?? true
      });
    }
    catch(error){
       console.error(
        "Failed to load candidate settings",
        error
      );
      // candidateProfileId is left at null here on purpose — rendering the settings
      // tabs anyway with a null id is what caused actions like resume upload to
      // silently call the API with "null" in place of a real id.
      setLoadError(true);
    }

    finally{

      setLoading(false);

    }
  };

  const renderTabContent = () => {
    switch(activeTab){
      case "personal":
         return (

          <PersonalSettings

            candidateProfileId={
              candidateProfileId
            }

            profile={
              profile
            }

            setProfile={
              setProfile
            }

            resumes={
              resumes
            }

            setResumes={
              setResumes
            }

            onNext={goToTab}
          />
        );

      case "profile":
        return (
          <ProfileSettings
            candidateProfileId={
              candidateProfileId
            }

            educationList={educationList}
            setEducationList={setEducationList}

            experienceList={experienceList}
            setExperienceList={setExperienceList}

            skills={skills}
            setSkills={setSkills}

            onNext={goToTab}
          />
        );

      case "social":
        return (
          <SocialLinksSettings
            candidateProfileId={
              candidateProfileId
            }
            socialLinks={
              socialLinks
            }
            setSocialLinks={
              setSocialLinks
            }
            onNext={goToTab}
          />
        );

      case "account":
        return (
          <AccountSettings
            candidateProfileId={
              candidateProfileId
            }
            accountSettings={
              accountSettings
            }
            setAccountSettings={
              setAccountSettings
            }
            onFinish={() =>
              setCompletedTabs((prev) => (prev.includes("account") ? prev : [...prev, "account"]))
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row border-x border-gray-200">
        <CandidateSidebar />
        <section className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Settings
          </h1>
          <SettingsTabs
            activeTab={
              activeTab
            }
            setActiveTab={
              setActiveTab
            }
            completedTabs={
              completedTabs
            }
          />
          {
            loading ? (
              <Loader />
            ) : loadError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                  Couldn't load your profile settings. The profile service may be unreachable.
                </p>
                <button
                  onClick={loadCandidateSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              renderTabContent()
            )
          }

        </section>
      </div>
    </div>
  );
}