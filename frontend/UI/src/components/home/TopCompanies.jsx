import { useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";

import { jobs } from "../../data/jobs";
import { getCompanyCounts, getCompanyInitials, getCompanyLogoStyle } from "../../utils/jobDisplay";

const topCompanies = getCompanyCounts(jobs).map((entry) => ({
  ...entry,
  location: jobs.find((job) => job.company === entry.company)?.location || "",
}));

export default function TopCompanies() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-10">
          Top companies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {topCompanies.map((company, index) => {
            const logoStyle = getCompanyLogoStyle(index);

            return (
              <div
                key={company.company}
                className="border border-gray-200 rounded-lg p-5 bg-white hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-md flex items-center justify-center font-bold ${logoStyle.bg} ${logoStyle.text}`}>
                    {getCompanyInitials(company.company)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {company.company}
                      </h3>
                      {index === 0 && (
                        <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      <FiMapPin />
                      {company.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/candidate/find-job?keyword=${encodeURIComponent(company.company)}`)}
                  className="w-full bg-blue-50 text-blue-600 py-3 rounded-md mt-5 font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Open Position ({company.count})
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
