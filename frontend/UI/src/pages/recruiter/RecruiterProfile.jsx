import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiGlobe, FiUsers, FiEdit2, FiMail } from "react-icons/fi";

import Loader from "../../components/common/Loader";
import {
  resolveRecruiterProfileId,
  getRecruiterSettings,
} from "../../services/recruiterSettingsService";

const getCompanyInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default function RecruiterProfile() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const recruiterProfileId = await resolveRecruiterProfileId();
        const settings = await getRecruiterSettings(recruiterProfileId);

        setCompany(settings.company || null);
      } catch (err) {
        console.error("Failed to load employer profile", err);
        setError("Unable to load your employer profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const location = [company?.city, company?.state, company?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Employer Profile
        </h1>

        <button
          onClick={() => navigate("/recruiter/settings")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition"
        >
          <FiEdit2 />
          Edit Profile
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && !company && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          You haven't set up your company profile yet. Complete it in Settings
          to have it appear here.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Banner */}
        {company?.banner ? (
          <div
            className="h-56 bg-cover bg-center"
            style={{ backgroundImage: `url(${company.banner})` }}
          />
        ) : (
          <div className="h-56 bg-gradient-to-r from-blue-600 to-sky-400" />
        )}

        {/* Company */}
        <div className="px-8 pb-8">
          <div className="-mt-16 flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow flex items-center justify-center overflow-hidden text-4xl font-bold text-blue-600">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.companyName || "Company logo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getCompanyInitials(company?.companyName)
              )}
            </div>

            <div className="pb-2">
              <h2 className="text-3xl font-semibold text-gray-900">
                {company?.companyName || "Company name not set"}
              </h2>

              <p className="text-gray-500 mt-2">
                {company?.industryType || "Industry not specified"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="border rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Company Information
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FiMail />
                  {company?.email || "Not provided"}
                </p>

                <p className="flex items-center gap-2">
                  <FiGlobe />
                  {company?.website || "Not provided"}
                </p>

                <p className="flex items-center gap-2">
                  <FiMapPin />
                  {location || "Location not specified"}
                </p>

                <p className="flex items-center gap-2">
                  <FiUsers />
                  {company?.teamSize
                    ? `${company.teamSize} Employees`
                    : "Team size not specified"}
                </p>
              </div>
            </div>

            <div className="md:col-span-2 border rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                About Company
              </h3>

              <p className="text-gray-600 leading-7">
                {company?.about || "No company description added yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
